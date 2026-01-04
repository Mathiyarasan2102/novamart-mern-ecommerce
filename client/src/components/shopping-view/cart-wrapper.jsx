import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0;

  return (
    <SheetContent className="w-full max-w-full sm:max-w-md backdrop:blur-2xl px-5 bg-white/80 flex flex-col h-full">
      <SheetHeader>
        <SheetTitle className="text-xl font-bold">Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-5 flex-1 overflow-y-auto pr-2 scrollbar-hide">
        {cartItems && cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartItems.map((item) => <UserCartItemsContent key={item.productId} cartItem={item} />)}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <span className="text-muted-foreground text-lg">Your cart is empty</span>
          </div>
        )}
      </div>
      <div className="mt-6 pt-4 border-t space-y-4 bg-transparent">
        <div className="flex justify-between">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-lg">₹{totalCartAmount.toFixed(2)}</span>
        </div>
        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full py-6 text-base"
        >
          Checkout
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;