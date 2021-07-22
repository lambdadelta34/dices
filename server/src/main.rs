mod handlers;
mod models;
mod routes;
mod utils;
use routes::dices::routes;
use tracing_subscriber::fmt::format::FmtSpan;
use warp::Filter;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter("warp=debug,dices=debug")
        .with_span_events(FmtSpan::CLOSE)
        // .json()
        .init();
    let redis = redis::Client::open("redis://127.0.0.1:6379/").unwrap();
    let routes = routes(redis.clone())
        .recover(handlers::rejections::error_handler)
        .with(warp::trace::request());
    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
}
