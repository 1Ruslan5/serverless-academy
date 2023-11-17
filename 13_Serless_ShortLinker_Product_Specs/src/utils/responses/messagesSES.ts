export const messagesSES = (name: string, link: string) => {
    let message: string;
    switch (name) {
        case 'Email verify':
            message = `<h1>Hello, dear user!</h1><p>Your link for verify your email: ${link}</p>`
            break;
        case "Deactivated notification":
            message = `<h1>Hello, dear user!</h1><p>Your link has been deactivated: ${link}</p>`
            break;
    }

    return { name, message }
}