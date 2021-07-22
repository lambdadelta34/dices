use serde::Serialize;

pub type Result<T> = std::result::Result<T, Error>;
pub type WebResult<T> = std::result::Result<T, warp::Rejection>;

#[derive(Debug)]
pub enum Error {
    GenericError,
}
impl warp::reject::Reject for Error {}

#[derive(Serialize)]
pub struct ErrorMessage {
    pub message: String,
}
