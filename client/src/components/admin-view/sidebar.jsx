import {
    BadgeCheck,
    ChartNoAxesCombined,
    LayoutDashboard,
    ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetDescription, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: <LayoutDashboard />,
    },
    {
        id: "products",
        label: "Products",
        path: "/admin/products",
        icon: <ShoppingBasket />,
    },
    {
        id: "orders",
        label: "Orders",
        path: "/admin/orders",
        icon: <BadgeCheck />,
    },
];

function MenuItems({ setOpen }) {
    const navigate = useNavigate();

    return (
        <nav className="mt-8 flex-col flex gap-2">
            {adminSidebarMenuItems.map((menuItem) => (
                <div
                    key={menuItem.id}
                    onClick={() => {
                        navigate(menuItem.path);
                        setOpen ? setOpen(false) : null;
                    }}
                    className="flex cursor-pointer hover:rounded-full hover:border-2 text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground  transition-all duration-200 hover:bg-muted hover:text-foreground border-2 border-transparent hover:border-gray-500"
                >
                    {menuItem.icon}
                    <span>{menuItem.label}</span>
                </div>
            ))}
        </nav>
    );
}

function AdminSideBar({ open, setOpen }) {
    const navigate = useNavigate();

    return (
        <Fragment>
            <Sheet open={open} onOpenChange={setOpen}>
                {open && (
                    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
                )}
                <SheetContent side="left" className="w-64 backdrop-blur-sm p-4 bg-white/70 shadow-lg">

                    <SheetHeader className="border-b">
                        <SheetTitle className="flex gap-2 mt-5 mb-5">
                            <div className="flex flex-col h-full">
                                <ChartNoAxesCombined size={30} />
                                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
                            </div>
                        </SheetTitle>
                        <SheetDescription>
                            Manage your products, orders, and customers here.
                        </SheetDescription>
                    </SheetHeader>
                    <MenuItems setOpen={setOpen} />

                </SheetContent>
            </Sheet>
            <aside className="hidden w-64 flex-col border-r bg-background p-4 lg:flex">
                <div
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex cursor-pointer items-center gap-2"
                >
                    <ChartNoAxesCombined size={30} />
                    <h1 className="text-2xl font-extrabold">Admin Panel</h1>
                </div>
                <MenuItems />
                <p className="text-sm text-muted-foreground m-2">
                    &copy; {new Date().getFullYear()} E-Commerce. All rights reserved.
                </p>
            </aside>

        </Fragment>
    );
}

export default AdminSideBar;