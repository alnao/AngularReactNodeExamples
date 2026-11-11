//$ npx babel-node des.js
function getProfileLink(username){
    return 'https://github-com/'+username;
}
function getProfileAvatar(username){
    return 'https://github-com/'+username +'.png?size=200';
}
function getProfile(username){
    return {
        link:getProfileLink(username),
        avatar:getProfileAvatar(username)
    };
}
console.log(
    getProfile("appacademy")
);