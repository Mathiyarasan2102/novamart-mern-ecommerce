import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 px-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-md w-full animate-in fade-in zoom-in duration-500">
                <div className="bg-red-50 p-4 rounded-full mb-6">
                    <SearchX className="h-16 w-16 text-red-500" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-2">
                    404
                </h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Page Not Found
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>
                <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link to="/shop/home">
                        Go Back Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}