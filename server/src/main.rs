mod handlers;
mod models;
mod routes;
mod utils;
use routes::dices::routes;
use tracing_subscriber::fmt::format::FmtSpan;
use warp::Filter;

#[tokio::main]
async fn main() {
    let filter = std::env::var("RUST_LOG").unwrap_or_else(|_| "warp=debug,dices=debug".into());
    let redis_host =
        std::env::var("REDIS_HOST").unwrap_or_else(|_| "redis://127.0.0.1:6379/".into());
    tracing_subscriber::fmt()
        .with_env_filter(filter)
        .with_span_events(FmtSpan::CLOSE)
        .json()
        .init();
    let redis = redis::Client::open(redis_host).unwrap();
    let manager = redis.get_tokio_connection_manager().await.unwrap();
    let routes = routes(manager)
        .recover(handlers::rejections::error_handler)
        .with(warp::trace::request());
    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
}
