type RequestType = "boardEvent"|"accountEvent"|"roomEvent";

//Use Generic types

interface BoardRequest{

}

type Request = "abc";

interface RedisRequest<T>{
    type:RequestType,
    request:T,
}

//Generic types :