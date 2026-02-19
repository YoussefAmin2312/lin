import { useState } from "react";
import { Minus, Plus, Check, Loader2, AlertCircle } from "lucide-react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CheckoutHeader from "../components/header/CheckoutHeader";
import Footer from "../components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { stripePromise, API_URL } from "@/lib/stripe";

// Stripe CardElement styling to match the site's aesthetic
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a1a",
      fontFamily: '"Inter", system-ui, sans-serif',
      fontWeight: "300",
      "::placeholder": {
        color: "#a1a1aa",
      },
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
};

// The inner checkout form that has access to Stripe hooks
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, updateQuantity, subtotal, clearCart } = useCart();

  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [hasSeparateBilling, setHasSeparateBilling] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [shippingOption, setShippingOption] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getShippingCost = () => {
    switch (shippingOption) {
      case "express":
        return 55;
      case "overnight":
        return 130;
      default:
        return 0;
    }
  };

  const shipping = getShippingCost();
  const vat = Math.round((subtotal + shipping) * 0.05);
  const total = subtotal + shipping + vat;

  const handleDiscountSubmit = () => {
    console.log("Discount code submitted:", discountCode);
    setShowDiscountInput(false);
  };

  const handleCustomerDetailsChange = (field: string, value: string) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleShippingAddressChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleBillingDetailsChange = (field: string, value: string) => {
    setBillingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompleteOrder = async () => {
    if (!stripe || !elements) {
      setErrorMessage("Payment system is still loading. Please wait.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage("Card input not found. Please refresh.");
      return;
    }

    if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName) {
      setErrorMessage("Please fill in all required customer details.");
      return;
    }
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.country) {
      setErrorMessage("Please fill in all required shipping address fields.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Debug log — check this in browser console
      console.log("Calling backend at:", API_URL);

      // Step 1: Create PaymentIntent
      const intentResponse = await fetch(`${API_URL}/api/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            priceNumeric: item.priceNumeric,
            quantity: item.quantity,
            category: item.category,
          })),
          shippingOption,
          customer: {
            email: customerDetails.email,
            firstName: customerDetails.firstName,
            lastName: customerDetails.lastName,
          },
        }),
      });

      const intentData = await intentResponse.json();
      console.log("PaymentIntent response:", intentData);

      if (!intentData.success) {
        throw new Error(intentData.error || "Failed to create payment intent.");
      }

      const { clientSecret } = intentData.data;

      // Step 2: Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${customerDetails.firstName} ${customerDetails.lastName}`,
            email: customerDetails.email,
            phone: customerDetails.phone || undefined,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed.");
      }

      if (paymentIntent?.status === "succeeded") {
        // Step 3: Save the order
        const orderResponse = await fetch(`${API_URL}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: customerDetails,
            shippingAddress,
            billingAddress: hasSeparateBilling ? billingDetails : shippingAddress,
            items: cartItems.map((item) => ({
              id: item.id,
              name: item.name,
              priceNumeric: item.priceNumeric,
              quantity: item.quantity,
              category: item.category,
              image: item.image,
            })),
            shippingOption,
            paymentIntentId: paymentIntent.id,
          }),
        });

        const orderData = await orderResponse.json();

        if (orderData.success && orderData.data?.orderNumber) {
          setOrderNumber(orderData.data.orderNumber);
        }

        setPaymentComplete(true);
        clearCart();
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && !paymentComplete) {
    return (
      <div className="min-h-screen bg-background">
        <CheckoutHeader />
        <main className="pt-6 pb-12">
          <div className="max-w-7xl mx-auto px-6 text-center py-20">
            <h1 className="text-2xl font-light text-foreground mb-4">Your bag is empty</h1>
            <p className="text-muted-foreground mb-6">Add items to your bag before checking out.</p>
            <Link to="/category/shop" className="text-sm font-light underline text-foreground hover:text-muted-foreground">
              Browse All Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CheckoutHeader />

      <main className="pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Order Summary */}
            <div className="lg:col-span-1 lg:order-2">
              <div className="bg-muted/20 p-8 rounded-none sticky top-6">
                <h2 className="text-lg font-light text-foreground mb-6">Order Summary</h2>

                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-none overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-light text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0 rounded-none border-muted-foreground/20"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium text-foreground min-w-[2ch] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 rounded-none border-muted-foreground/20"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-foreground font-medium text-sm">
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code Section */}
                <div className="mt-8 pt-6 border-t border-muted-foreground/20">
                  {!showDiscountInput ? (
                    <button
                      onClick={() => setShowDiscountInput(true)}
                      className="text-sm text-foreground underline hover:no-underline transition-all"
                    >
                      Discount code
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder="Enter discount code"
                          className="flex-1 rounded-none"
                        />
                        <button
                          onClick={handleDiscountSubmit}
                          className="text-sm text-foreground underline hover:no-underline transition-all px-2"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-muted-foreground/20 mt-4 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">AED {subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Column - Forms */}
            <div className="lg:col-span-2 lg:order-1 space-y-8">

              {/* Customer Details Form */}
              <div className="bg-muted/20 p-8 rounded-none">
                <h2 className="text-lg font-light text-foreground mb-6">Customer Details</h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-light text-foreground">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) => handleCustomerDetailsChange("email", e.target.value)}
                      className="mt-2 rounded-none"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-light text-foreground">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={customerDetails.firstName}
                        onChange={(e) => handleCustomerDetailsChange("firstName", e.target.value)}
                        className="mt-2 rounded-none"
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-light text-foreground">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={customerDetails.lastName}
                        onChange={(e) => handleCustomerDetailsChange("lastName", e.target.value)}
                        className="mt-2 rounded-none"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-light text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) => handleCustomerDetailsChange("phone", e.target.value)}
                      className="mt-2 rounded-none"
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="border-t border-muted-foreground/20 pt-6 mt-8">
                    <h3 className="text-base font-light text-foreground mb-4">Shipping Address</h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="shippingAddress" className="text-sm font-light text-foreground">
                          Address *
                        </Label>
                        <Input
                          id="shippingAddress"
                          type="text"
                          value={shippingAddress.address}
                          onChange={(e) => handleShippingAddressChange("address", e.target.value)}
                          className="mt-2 rounded-none"
                          placeholder="Street address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shippingCity" className="text-sm font-light text-foreground">
                            City / Emirate *
                          </Label>
                          <Input
                            id="shippingCity"
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) => handleShippingAddressChange("city", e.target.value)}
                            className="mt-2 rounded-none"
                            placeholder="Dubai"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shippingPostalCode" className="text-sm font-light text-foreground">
                            P.O. Box
                          </Label>
                          <Input
                            id="shippingPostalCode"
                            type="text"
                            value={shippingAddress.postalCode}
                            onChange={(e) => handleShippingAddressChange("postalCode", e.target.value)}
                            className="mt-2 rounded-none"
                            placeholder="P.O. Box"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="shippingCountry" className="text-sm font-light text-foreground">
                          Country *
                        </Label>
                        <Input
                          id="shippingCountry"
                          type="text"
                          value={shippingAddress.country}
                          onChange={(e) => handleShippingAddressChange("country", e.target.value)}
                          className="mt-2 rounded-none"
                          placeholder="United Arab Emirates"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Address Checkbox */}
                  <div className="border-t border-muted-foreground/20 pt-6 mt-8">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="separateBilling"
                        checked={hasSeparateBilling}
                        onCheckedChange={(checked) => setHasSeparateBilling(checked === true)}
                      />
                      <Label
                        htmlFor="separateBilling"
                        className="text-sm font-light text-foreground cursor-pointer"
                      >
                        Other billing address
                      </Label>
                    </div>
                  </div>

                  {/* Billing Details */}
                  {hasSeparateBilling && (
                    <div className="space-y-6 pt-4">
                      <h3 className="text-base font-light text-foreground">Billing Details</h3>

                      <div>
                        <Label htmlFor="billingEmail" className="text-sm font-light text-foreground">
                          Email Address *
                        </Label>
                        <Input
                          id="billingEmail"
                          type="email"
                          value={billingDetails.email}
                          onChange={(e) => handleBillingDetailsChange("email", e.target.value)}
                          className="mt-2 rounded-none"
                          placeholder="Enter billing email"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingFirstName" className="text-sm font-light text-foreground">
                            First Name *
                          </Label>
                          <Input
                            id="billingFirstName"
                            type="text"
                            value={billingDetails.firstName}
                            onChange={(e) => handleBillingDetailsChange("firstName", e.target.value)}
                            className="mt-2 rounded-none"
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingLastName" className="text-sm font-light text-foreground">
                            Last Name *
                          </Label>
                          <Input
                            id="billingLastName"
                            type="text"
                            value={billingDetails.lastName}
                            onChange={(e) => handleBillingDetailsChange("lastName", e.target.value)}
                            className="mt-2 rounded-none"
                            placeholder="Last name"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="billingPhone" className="text-sm font-light text-foreground">
                          Phone Number
                        </Label>
                        <Input
                          id="billingPhone"
                          type="tel"
                          value={billingDetails.phone}
                          onChange={(e) => handleBillingDetailsChange("phone", e.target.value)}
                          className="mt-2 rounded-none"
                          placeholder="+971 XX XXX XXXX"
                        />
                      </div>

                      <div>
                        <Label htmlFor="billingAddress" className="text-sm font-light text-foreground">
                          Address *
                        </Label>
                        <Input
                          id="billingAddress"
                          type="text"
                          value={billingDetails.address}
                          onChange={(e) => handleBillingDetailsChange("address", e.target.value)}
                          className="mt-2 rounded-none"
                          placeholder="Street address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingCity" className="text-sm font-light text-foreground">
                            City / Emirate *
                          </Label>
                          <Input
                            id="billingCity"
                            type="text"
                            value={billingDetails.city}
                            onChange={(e) => handleBillingDetailsChange("city", e.target.value)}
                            className="mt-2 rounded-none"
                            placeholder="Dubai"
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingPostalCode" className="text-sm font-light text-foreground">
                            P.O. Box
                          </Label>
                          <Input
                            id="billingPostalCode"
                            type="text"
                            value={billingDetails.postalCode}
                            onChange={(e) => handleBillingDetailsChange("postalCode", e.target.value)}
                            className="mt-2 rounded-none"
                            placeholder="P.O. Box"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="billingCountry" className="text-sm font-light text-foreground">
                          Country *
                        </Label>
                        <Input
                          id="billingCountry"
                          type="text"
                          value={billingDetails.country}
                          onChange={(e) => handleBillingDetailsChange("country", e.target.value)}
                          className="mt-2 rounded-none"
                          placeholder="United Arab Emirates"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Options */}
              <div className="bg-muted/20 p-8 rounded-none">
                <h2 className="text-lg font-light text-foreground mb-6">Shipping Options</h2>

                <RadioGroup
                  value={shippingOption}
                  onValueChange={setShippingOption}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-light text-foreground">
                        Standard Shipping
                      </Label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Free • 3-5 business days
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="font-light text-foreground">
                        Express Shipping
                      </Label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      AED 55 • 1-2 business days
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="overnight" id="overnight" />
                      <Label htmlFor="overnight" className="font-light text-foreground">
                        Overnight Delivery
                      </Label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      AED 130 • Next business day
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Section */}
              <div className="bg-muted/20 p-8 rounded-none">
                <h2 className="text-lg font-light text-foreground mb-6">Payment Details</h2>

                {!paymentComplete ? (
                  <div className="space-y-6">
                    {/* Stripe Card Element */}
                    <div>
                      <Label className="text-sm font-light text-foreground">
                        Card Details *
                      </Label>
                      <div className="mt-2 p-3 border border-input bg-background rounded-none">
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Secure payment powered by Stripe
                      </p>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-none">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Order Total Summary */}
                    <div className="bg-muted/10 p-6 rounded-none border border-muted-foreground/20 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">AED {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-foreground">
                          {shipping === 0 ? "Free" : `AED ${shipping}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">VAT (5%)</span>
                        <span className="text-foreground">AED {vat.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-medium border-t border-muted-foreground/20 pt-3">
                        <span className="text-foreground">Total</span>
                        <span className="text-foreground">AED {total.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCompleteOrder}
                      disabled={isProcessing || !stripe}
                      className="w-full rounded-none h-12 text-base"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing Payment...
                        </span>
                      ) : (
                        `Complete Order • AED ${total.toLocaleString()}`
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-light text-foreground mb-2">Order Complete!</h3>
                    {orderNumber && (
                      <p className="text-sm font-medium text-foreground mb-2">
                        Order #{orderNumber}
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      Thank you for your purchase. Your order confirmation has been sent to your email.
                    </p>
                    <Link
                      to="/"
                      className="inline-block mt-6 text-sm font-light underline text-foreground hover:text-muted-foreground"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Wrapper component that provides the Stripe context
const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
