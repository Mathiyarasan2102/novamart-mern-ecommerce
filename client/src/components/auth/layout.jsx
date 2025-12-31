import { Outlet } from "react-router-dom";
import loginBanner from "../../assets/login-banner.jpg";

function AuthLayout() {
    return (
        <div className="flex min-h-screen w-full">
            <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12 relative overflow-hidden">
                {/* Background Image */}
                <img
                    src={loginBanner}
                    alt="Login Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/60 z-10" />

                {/* Content */}
                <div className="max-w-md space-y-6 text-center text-primary-foreground relative z-20">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">Welcome to Nova Mart Shopping</h1>
                    <p className="text-lg font-medium text-gray-200">
                        Where quality meets convenience.
                    </p>
                </div>
            </div>
            <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                <Outlet />
            </div>
        </div>

    )
}

export default AuthLayout;