use axum::{
    Json, Router,
    extract::{Path, State},
    http::StatusCode,
    routing::get,
    serve,
};
use reqwest::Client;
use serde_json::{Value, json};
use tokio::net::TcpListener;

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
) -> Result<Json<Value>, StatusCode> {
    let base_url = format!("https://api.github.com/users/{username}");
    let user = client
        .get(&base_url)
        .send()
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    if !user.status().is_success() {
        return Err(StatusCode::from_u16(user.status().as_u16()).unwrap_or(StatusCode::BAD_GATEWAY));
    }

    let profile: Value = user
        .json()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(json!({"profile": profile})))
}
