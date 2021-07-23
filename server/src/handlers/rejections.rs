use crate::utils;
use std::error::Error;
use warp::http::StatusCode;

pub async fn error_handler(error: warp::Rejection) -> utils::WebResult<impl warp::Reply> {
    tracing::info!("ERR {:?}", error);
    let code;
    let message;
    if let Some(e) = error.find::<warp::filters::body::BodyDeserializeError>() {
        code = StatusCode::BAD_REQUEST;
        message = match e.source() {
            Some(cause) => cause.to_string(),
            None => "BAD_REQUEST".into(),
        };
        tracing::info!("dese {:?}", e);
    } else if let Some(e) = error.find::<utils::Error>() {
        let result = handle_crate_error(e);
        code = result.0;
        message = result.1;
    } else {
        code = StatusCode::NOT_FOUND;
        message = "Oops not found".into();
    }

    let json = warp::reply::json(&utils::ErrorMessage { message: message });

    Ok(warp::reply::with_status(json, code))
}

fn handle_crate_error(e: &utils::Error) -> (StatusCode, String) {
    tracing::info!("ue {:?}", e);
    match e {
        utils::Error::Validation(errors) => {
            (StatusCode::BAD_REQUEST, format!("{:?}", errors.errors()))
        },
        utils::Error::GenericError => {
            (StatusCode::BAD_REQUEST, "error".into())
        }
    }
}
