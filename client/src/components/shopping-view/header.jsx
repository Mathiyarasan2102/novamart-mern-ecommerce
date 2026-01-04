import { HouseIcon, LogOut, Menu, ShoppingCart, UserCog, Search } from "lucide-react";
import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { AvatarImage } from "@radix-ui/react-avatar";

function MenuItems({ closeMenu }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();

	function handleNavigate(getCurrentMenuItem) {
		sessionStorage.removeItem("filters");
		const currentFilter =
			getCurrentMenuItem.id !== "home" &&
				getCurrentMenuItem.id !== "products" &&
				getCurrentMenuItem.id !== "search"
				? {
					category: [getCurrentMenuItem.id],
				}
				: null;

		sessionStorage.setItem("filters", JSON.stringify(currentFilter));

		location.pathname.includes("listing") && currentFilter !== null
			? setSearchParams(
				new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
			)
			: navigate(getCurrentMenuItem.path);

		if (closeMenu) closeMenu();
	}

	return (
		<nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
			{shoppingViewHeaderMenuItems.map((menuItem) => (
				<Label
					onClick={() => handleNavigate(menuItem)}
					className="text-sm font-medium cursor-pointer hover:text-primary transition-colors duration-200"
					key={menuItem.id}
				>
					{menuItem.label}
				</Label>
			))}
		</nav>
	);
}

function HeaderRightContent({ hideCart }) {
	const { user, isAuthenticated } = useSelector((state) => state.auth); // Added isAuthenticated
	const { cartItems } = useSelector((state) => state.shopCart);
	const [openCartSheet, setOpenCartSheet] = useState(false);
	const navigate = useNavigate();
	const location = useLocation(); // Include useLocation
	const dispatch = useDispatch();

	function handleLogout() {
		dispatch(logoutUser());
	}

	useEffect(() => {
		if (user?.id) {
			dispatch(fetchCartItems(user?.id));
		}
	}, [dispatch, user]);

	if (!isAuthenticated) {
		return (
			<div className="flex lg:items-center lg:flex-row flex-col gap-4">
				<Button
					variant="outline"
					size="icon"
					className="hidden lg:flex"
					onClick={() => navigate("/shop/search")}
				>
					<Search className="w-6 h-6" />
					<span className="sr-only">Search</span>
				</Button>
				{!hideCart && (
					<Button
						onClick={() => navigate('/auth/login', { state: { from: location } })}
						variant="outline"
						size="icon"
						className="relative"
					>
						<ShoppingCart className="w-6 h-6" />
						<span className="sr-only">User cart</span>
					</Button>
				)}
				<Button
					onClick={() => navigate('/auth/login', { state: { from: location } })}
					className="font-medium"
				>
					Login
				</Button>
			</div>
		);
	}

	return (
		<div className="flex lg:items-center lg:flex-row flex-col gap-4">
			<Button
				variant="outline"
				size="icon"
				className="hidden lg:flex"
				onClick={() => navigate("/shop/search")}
			>
				<Search className="w-6 h-6" />
				<span className="sr-only">Search</span>
			</Button>
			{!hideCart && (
				<Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
					<Button
						onClick={() => setOpenCartSheet(true)}
						variant="outline"
						size="icon"
						className="relative"
					>
						<ShoppingCart className="w-6 h-6" />
						<span className="absolute top-[-5px] right-[2px] font-bold text-sm">
							{cartItems?.items?.length || 0}
						</span>
						<span className="sr-only">User cart</span>
					</Button>
					<UserCartWrapper
						setOpenCartSheet={setOpenCartSheet}
						cartItems={
							cartItems && cartItems.items && cartItems.items.length > 0
								? cartItems.items
								: []
						}
					/>
				</Sheet>
			)}

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Avatar className="bg-black">
						<AvatarFallback className="bg-black cursor-pointer text-white font-extrabold">
							{user?.userName[0].toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="bottom" className="w-56 m-2 backdrop-blur-lg">
					<DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => navigate("/shop/account")}>
						<UserCog className="mr-2 h-4 w-4" />
						Account
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function ShoppingHeader() {
	const { isAuthenticated, user } = useSelector((state) => state.auth);
	const { cartItems } = useSelector((state) => state.shopCart);
	const [openCartSheet, setOpenCartSheet] = useState(false);
	const [openMenu, setOpenMenu] = useState(false);
	const navigate = useNavigate();

	// Close mobile menu if resized to desktop view
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024 && openMenu) {
				setOpenMenu(false);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [openMenu]);

	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background">
			<div className="flex h-16 items-center justify-between px-4 md:px-6">
				<Link to="/shop/home" className="flex items-center gap-2">
					<HouseIcon className="h-6 w-6" />
					<span className="font-bold">NovaMart</span>
				</Link>

				{/* Mobile Right Section */}
				<div className="flex items-center gap-2 lg:hidden">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate('/shop/search')}
						className="text-foreground"
					>
						<Search className="w-6 h-6" />
						<span className="sr-only">Search</span>
					</Button>

					<Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
						<Button
							onClick={() => {
								if (!isAuthenticated) {
									navigate('/auth/login');
									return;
								}
								setOpenCartSheet(true);
							}}
							variant="outline"
							size="icon"
							className="relative"
						>
							<ShoppingCart className="w-6 h-6" />
							{isAuthenticated && cartItems?.items?.length > 0 && (
								<span className="absolute top-[-5px] right-[2px] font-bold text-sm bg-red-500 text-white rounded-full px-1 min-w-[1.25rem]">
									{cartItems.items.length}
								</span>
							)}
							<span className="sr-only">User cart</span>
						</Button>
						{isAuthenticated && (
							<UserCartWrapper
								setOpenCartSheet={setOpenCartSheet}
								cartItems={
									cartItems && cartItems.items && cartItems.items.length > 0
										? cartItems.items
										: []
								}
							/>
						)}
					</Sheet>

					<HeaderRightContent hideCart={true} />

					<Sheet open={openMenu} onOpenChange={setOpenMenu}>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon">
								<Menu className="h-6 w-6" />
								<span className="sr-only">Toggle header menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-full max-w-xs overflow-y-auto">
							<SheetHeader className="mb-8">
								<SheetTitle>
									<div className="flex items-center gap-2">
										<HouseIcon className="h-6 w-6" />
										<span className="font-bold text-xl">NovaMart</span>
									</div>
								</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col gap-6 px-4">
								<MenuItems closeMenu={() => setOpenMenu(false)} />
							</div>
						</SheetContent>
					</Sheet>
				</div>

				<div className="hidden lg:block">
					<MenuItems />
				</div>

				<div className="hidden lg:block">
					<HeaderRightContent />
				</div>
			</div>
		</header>
	);
}

export default ShoppingHeader;