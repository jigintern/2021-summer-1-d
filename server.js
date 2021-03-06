import { Server } from "./server/sabaeSever.js";

const db = [];

const commentGet = (req) => {
    let x = req.x;
    let y = req.y;
    if (!x || !y){
        return { result: {}, status: "error" }
    }
    if (db[x] == undefined || db[x][y] == undefined) {
        return { result: {}, status: "error" }
    }
    return { result: { x: x, y: y, data: db[x][y] }, status: "success" };
}

const commentPost = (req, cookies) => {
    let x = req.x;
    let y = req.y;
    if (!x || !y){
        return { status: "error" }
    }
    if(!req.data) {
        return { status: "error" }
    }

    if(!db[x]){
        db[x] = [];
    }
    if(!db[x][y]) {
        db[x][y] = [];
    }
    db[x][y].push(req.data);

    if ( !cookies.exp ) {
        cookies.exp = 0;
    } else {
        cookies.exp++;
    }
    return { status: "success", cookie: { name: "exp", value: String(cookies.exp), path: "/" }};
}

class MyServer extends Server {
    api(path, req, addr, cookies) {

        if (path.startsWith("/api/comment/get")) {

            let res = commentGet(req);
            return [{ result: res.result, status: res.status }, null];

        } else if (path.startsWith("/api/comment/post")) {

            let res = commentPost(req, cookies);
            return [{ status: res.status }, res.cookie];

        }
    }
}

new MyServer(8884);