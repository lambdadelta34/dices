use serde::de::DeserializeOwned;
use serde::Serialize;
use validator::{Validate, ValidationErrors};
use warp::Filter;

pub type Result<T> = std::result::Result<T, Error>;
pub type WebResult<T> = std::result::Result<T, warp::Rejection>;

#[derive(Debug)]
pub enum Error {
    GenericError,
    Validation(ValidationErrors),
}
impl warp::reject::Reject for Error {}

#[derive(Serialize)]
pub struct ErrorMessage {
    pub message: String,
}

pub fn with_validated_json<T>() -> impl Filter<Extract = (T,), Error = warp::Rejection> + Clone
where
    T: DeserializeOwned + Validate + Send,
{
    warp::body::content_length_limit(1024 * 1)
        .and(warp::body::json())
        .and_then(|value| async move { validate(value).map_err(warp::reject::custom) })
}

fn validate<T>(value: T) -> Result<T>
where
    T: Validate,
{
    value.validate().map_err(Error::Validation)?;

    Ok(value)
}
