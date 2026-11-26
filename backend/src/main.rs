use axum::{
    Json, Router,
    extract::{Path, State},
    http::StatusCode,
    routing::get,
    serve,
};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use tokio::net::TcpListener;

#[derive(Deserialize, Serialize)]
struct GitHubProfile {
    login: String,
    avatar_url: String,
    html_url: String,
    name: Option<String>,
    top_languages: Option<Vec<String>>,
    bio: Option<String>,
    company: Option<String>,
    location: Option<String>,
    email: Option<String>,
    website_url: Option<String>,
    followers_count: Option<u32>,
    following_count: Option<u32>,
    repositories_count: Option<u32>,
    created_at: Option<String>,
}

#[derive(Serialize)]
struct UserLookupResponse {
    profile: GitHubProfile,
}

#[tokio::main]
async fn main() {
    let client = Client::builder().user_agent("gitwatson").build().unwrap();
    let app = Router::new()
        .route("/api/users/{username}", get(get_user))
        .with_state(client);
    let listener = TcpListener::bind("127.0.0.1:3000").await.unwrap();

    serve(listener, app).await.unwrap();
}

async fn get_user(
    State(client): State<Client>,
    Path(username): Path<String>,
) -> Result<Json<UserLookupResponse>, StatusCode> {
    let base_url = format!("https://api.github.com/users/{username}");
    let user = client
        .get(&base_url)
        .send()
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    if !user.status().is_success() {
        return Err(StatusCode::from_u16(user.status().as_u16()).unwrap_or(StatusCode::BAD_GATEWAY));
    }

    let profile: GitHubProfile = user
        .json()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(UserLookupResponse { profile }))
}
