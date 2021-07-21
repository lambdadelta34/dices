mod handlers;
mod models;
mod routes;
mod utils;
use routes::dices::routes;

#[tokio::main]
async fn main() {
    // let client = redis::Client::open("redis://127.0.0.1:6379/").unwrap();
    // let mut con = client.get_async_connection().await.unwrap();
    let routes = routes();
    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
}
