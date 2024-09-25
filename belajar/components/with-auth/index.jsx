export function withAuth(Component){
    return function WithAuth(props){
        const isLogin = true;

        if(!isLogin) return <div>Anda harus Login</div>
        return <Component {...props} />
    }
}