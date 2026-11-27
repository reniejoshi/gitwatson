use std::{collections::HashMap, sync::Arc, time::Duration};

use axum::{
    Json, Router,
    extract::{Path, State},
    http::StatusCode,
    routing::get,
    serve,
};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use tokio::{net::TcpListener, sync::Mutex, time::Instant};

type Cache = Arc<Mutex<HashMap<String, (Instant, UserLookupResponse)>>>;

#[derive(Clone)]
struct AppState {
    client: Client,
    cache: Cache,
}

#[derive(Deserialize, Serialize, Clone)]
struct GitHubProfile {
    login: String,
    avatar_url: String,
    html_url: String,
    name: Option<String>,
    top_languages: Option<Vec<String>>,
    bio: Option<String>,
    status_message: Option<String>,
    company: Option<String>,
    location: Option<String>,
    email: Option<String>,
    #[serde(alias = "blog")]
    website_url: Option<String>,
    #[serde(alias = "followers")]
    followers_count: Option<u32>,
    #[serde(alias = "following")]
    following_count: Option<u32>,
    #[serde(alias = "public_repos")]
    repositories_count: Option<u32>,
    created_at: Option<String>,
}

#[derive(Serialize, Clone)]
struct UserLookupResponse {
    profile: GitHubProfile,
}

#[derive(Deserialize)]
struct RepoLang {
    language: Option<String>,
}

#[tokio::main]
async fn main() {
    let client = Client::builder().user_agent("gitwatson").build().unwrap();
    let state = AppState {
        client: client.clone(),
        cache: Arc::new(Mutex::new(HashMap::new())),
    };
    let app = Router::new()
        .route("/api/users/{username}", get(get_user))
        .with_state(state);
    let listener = TcpListener::bind("127.0.0.1:3000").await.unwrap();

    serve(listener, app).await.unwrap();
}

async fn get_user(
    State(state): State<AppState>,
    Path(raw_username): Path<String>,
) -> Result<Json<UserLookupResponse>, StatusCode> {
    let username = raw_username.trim().to_lowercase();
    let ttl = Duration::from_secs(600);

    {
        let cache = state.cache.lock().await;
        if let Some((fetched_at, cached)) = cache.get(&username)
            && fetched_at.elapsed() < ttl
        {
            return Ok(Json(cached.clone()));
        }
    }

    let base_url = format!("https://api.github.com/users/{username}");
    let (user_res, repos_res, page_res) = tokio::join!(
        state.client.get(&base_url).send(),
        state
            .client
            .get(format!("{base_url}/repos?per_page=100"))
            .send(),
        state
            .client
            .get(format!("https://github.com/{username}"))
            .send()
    );
    let user = user_res.map_err(|_| StatusCode::BAD_GATEWAY)?;
    let repos = repos_res.map_err(|_| StatusCode::BAD_GATEWAY)?;

    if !user.status().is_success() {
        return Err(StatusCode::from_u16(user.status().as_u16()).unwrap_or(StatusCode::BAD_GATEWAY));
    }

    let mut profile: GitHubProfile = user
        .json()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let repos: Vec<RepoLang> = repos
        .json()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let mut langs = HashMap::new();
    for repo in repos {
        if let Some(lang) = repo.language {
            *langs.entry(lang).or_insert(0) += 1;
        }
    }

    let mut sorted_langs: Vec<(String, usize)> = langs.into_iter().collect();
    sorted_langs.sort_by(|a, b| b.1.cmp(&a.1));
    let top_languages: Vec<String> = sorted_langs
        .into_iter()
        .take(5)
        .map(|(lang, _)| lang)
        .collect();
    profile.top_languages = (!top_languages.is_empty()).then_some(top_languages);

    if let Ok(page) = page_res
        && let Ok(html) = page.text().await
    {
        for chunk in html.split("user-status-container").skip(1) {
            let block = &chunk[..chunk.len().min(2500)];

            if profile.status_message.is_none()
                && let Some((_, after_msg)) = block.split_once("user-status-message-wrapper")
                && let Some((before_close, _)) = after_msg.split_once("</div>")
                && let Some((_, raw_msg)) = before_close.rsplit_once('>')
            {
                let msg = raw_msg.trim();
                if !msg.is_empty() {
                    profile.status_message = Some(msg.to_string());
                }
            }
        }
    }

    let response = UserLookupResponse {
        profile: profile.clone(),
    };
    state
        .cache
        .lock()
        .await
        .insert(username, (Instant::now(), response.clone()));
    Ok(Json(response))
}
