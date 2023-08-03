
export const is_valid = (link: string) => {
    console.log(link.match(/#/g).length)
    if (link.match(/#/g).length > 1) throw new Error("this link is not valid");
}

export const usernameOfLink = (link: string) => {
    return link.split("#")[1]
}