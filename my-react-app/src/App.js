import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, ShoppingCart, List, ChevronsRight, Loader2, MinusCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

interface FoodItem {
    id: string;
    name: string;
    price: number;
}

interface Order {
    id: string;
    personName: string;
    foodItems: { id: string; name: string; price: number; quantity: number }[];
    totalAmount: number;
}

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const FoodItemCard = ({ food, onSelect, quantity, onQuantityChange }: { food: FoodItem; onSelect: (food: FoodItem) => void; quantity: number; onQuantityChange: (id: string, quantity: number) => void }) => {

    const handleAdd = () => {
        if (quantity > 0) {
            onSelect({ ...food, quantity });
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200"
        >
            <h3 className="text-lg font-semibold text-white">{food.name}</h3>
            <p className="text-gray-400">Price: ${food.price.toFixed(2)}</p>
            <div className="mt-4 flex items-center gap-4">
                <Input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => onQuantityChange(food.id, parseInt(e.target.value, 10))}
                    className="w-20 bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500"
                    placeholder="Qty"
                />
                <Button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                    disabled={quantity === 0}
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add
                </Button>
            </div>
        </motion.div>
    );
};

const OrderSummary = ({ order }: { order: Order }) => {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 shadow-md"
        >
            <h3 className="text-lg font-semibold text-white">Order for: {order.personName}</h3>
            <ul className="mt-2 space-y-1">
                {order.foodItems.map((item) => (
                    <li key={item.id} className="text-gray-300 flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                ))}
            </ul>
            <p className="mt-2 font-semibold text-white">Total: ${order.totalAmount.toFixed(2)}</p>
        </motion.div>
    );
};

const SummaryPage = ({ orders, onBack }: { orders: Order[], onBack: () => void }) => {
    const [surcharge, setSurcharge] = useState<number>(0);
    const [peopleCount, setPeopleCount] = useState<number>(1);
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const surchargePerPerson = peopleCount > 0 ? surcharge / peopleCount : 0;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white text-center">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => {
                    const orderTotalWithSurcharge = order.totalAmount + surchargePerPerson;
                    return (
                    <motion.div
                        key={order.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 shadow-md"
                    >
                        <h3 className="text-lg font-semibold text-white">Order for: {order.personName}</h3>
                        <ul className="mt-2 space-y-1">
                            {order.foodItems.map((item) => (
                                <li key={item.id} className="text-gray-300 flex justify-between">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-2 font-semibold text-white">Total: ${order.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-yellow-400">Surcharge: ${surchargePerPerson.toFixed(2)}</p>
                        <p className="mt-1 font-semibold text-white">
                            Total with Surcharge: ${orderTotalWithSurcharge.toFixed(2)}
                        </p>
                    </motion.div>
                )})}
            </div>
            <div className="mt-8 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-md space-y-4 flex flex-col items-center">
                <div>
                    <h3 className="text-2xl font-semibold text-white">Total Revenue</h3>
                    <p className="text-green-400 text-xl">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className='w-full space-y-2'>
                    <Input
                        type="number"
                        placeholder="Surcharge Amount"
                        value={surcharge || ''}
                        onChange={(e) => setSurcharge(Number(e.target.value) || 0)}
                        className="bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500"
                    />
                    <Input
                        type="number"
                        placeholder="Number of People"
                        value={peopleCount || ''}
                        onChange={(e) => setPeopleCount(Number(e.target.value) || 1)}
                        className="bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500"
                    />
                    <p className="text-yellow-400">Surcharge per person: ${surchargePerPerson.toFixed(2)}</p>
                </div>
                <Button
                    onClick={onBack}
                    className="mt-4 bg-gray-700 hover:bg-gray-600 text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Order
                </Button>
            </div>
        </div>
    );
};

const FoodOrderApp = () => {
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order>({
        id: '',
        personName: '',
        foodItems: [],
        totalAmount: 0,
    });
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState<'foodList' | 'order' | 'summary'>('foodList');
    const [loading, setLoading] = useState(false);
    const [newFoodName, setNewFoodName] = useState('');
    const [newFoodPrice, setNewFoodPrice] = useState('');
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({}); // Track quantities

    // Load data from localStorage
    useEffect(() => {
        const storedFoodItems = localStorage.getItem('foodItems');
        const storedOrders = localStorage.getItem('orders');
        if (storedFoodItems) {
            setFoodItems(JSON.parse(storedFoodItems));
        }
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        }
    }, []);

    // Save data to localStorage
    useEffect(() => {
        localStorage.setItem('foodItems', JSON.stringify(foodItems));
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [foodItems, orders]);

    const handleAddFoodItem = () => {
        if (newFoodName.trim() && !isNaN(Number(newFoodPrice))) {
            const newFood: FoodItem = {
                id: crypto.randomUUID(),
                name: newFoodName.trim(),
                price: Number(newFoodPrice),
            };
            setFoodItems([...foodItems, newFood]);
            setNewFoodName('');
            setNewFoodPrice('');
            setQuantities({}); //reset quantities
        }
    };

    const handleFoodSelect = (selectedFood: FoodItem) => {
        const existingItem = currentOrder.foodItems.find(item => item.id === selectedFood.id);
        let updatedItems;
        if (existingItem) {
            updatedItems = currentOrder.foodItems.map(item =>
                item.id === selectedFood.id ? { ...item, quantity: item.quantity + selectedFood.quantity } : item
            );
        } else {
            updatedItems = [...currentOrder.foodItems, { ...selectedFood, quantity: selectedFood.quantity }];
        }

        const newTotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setCurrentOrder({ ...currentOrder, foodItems: updatedItems, totalAmount: newTotal });
    };

    const handlePlaceOrder = () => {
        if (currentOrder.personName.trim() && currentOrder.foodItems.length > 0) {
            setOrders([...orders, { ...currentOrder, id: crypto.randomUUID() }]);
            setCurrentOrder({ id: '', personName: '', foodItems: [], totalAmount: 0 }); // Reset for next order
            setPage('order'); // Stay on order page for next person
            setQuantities({});
        }
    };

    const handleNextPerson = () => {
        if (currentOrder.personName.trim() && currentOrder.foodItems.length > 0) {
             const orderedItems = foodItems.map(food => {
                const quantity = quantities[food.id] || 0;
                return {
                    ...food,
                    quantity: quantity,
                };
            }).filter(item => item.quantity > 0); // Remove items with 0 quantity

            const newTotal = orderedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
             setOrders([...orders, {
                id: crypto.randomUUID(),
                personName: currentOrder.personName,
                foodItems: orderedItems,
                totalAmount: newTotal
            }]);
            setCurrentOrder({ id: '', personName: '', foodItems: [], totalAmount: 0 }); // Reset for next order
        }
        setPage('order');
        setQuantities({});
    };

    const handleViewSummary = () => {
         const orderedItems = foodItems.map(food => {
                const quantity = quantities[food.id] || 0;
                return {
                    ...food,
                    quantity: quantity,
                };
            }).filter(item => item.quantity > 0); // Remove items with 0 quantity

            const newTotal = orderedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        if (currentOrder.personName.trim() && currentOrder.foodItems.length > 0) {
            setOrders([...orders,  {
                id: crypto.randomUUID(),
                personName: currentOrder.personName,
                foodItems: orderedItems,
                totalAmount: newTotal
            }]);
        }
        setPage('summary');
    };

    const startLoading = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000); // Simulate loading for 1 second
    };

    const handleQuantityChange = (id: string, quantity: number) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [id]: quantity,
        }));
    };

    const goToOrderPage = () => {
        setPage('order');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                        Erwyn's Awesome Bill Counter
                    </h1>
                    <p className="text-gray-400 text-lg sm:text-xl md:text-2xl">
                        Order your favorite food!
                    </p>
                </motion.div>

                <AnimatePresence mode='wait'>
                    {page === 'foodList' && (
                        <motion.div
                            key="foodList"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-6"
                        >
                            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-4">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold text-white flex items-center gap-2">
                                        <List className="w-6 h-6" />
                                        Food List
                                    </CardTitle>
                                    <CardDescription className="text-gray-300">
                                        Select the food items you want to order.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {foodItems.map((food) => (
                                            <FoodItemCard
                                                key={food.id}
                                                food={food}
                                                onSelect={handleFoodSelect}
                                                quantity={quantities[food.id] || 0}
                                                onQuantityChange={handleQuantityChange}
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-6 space-y-4">
                                        <h3 className="text-lg font-semibold text-white">Add New Food Item</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Input
                                                type="text"
                                                placeholder="Food Name"
                                                value={newFoodName}
                                                onChange={(e) => setNewFoodName(e.target.value)}
                                                className="bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Price"
                                                value={newFoodPrice}
                                                onChange={(e) => setNewFoodPrice(e.target.value)}
                                                className="bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleAddFoodItem}
                                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                                        >
                                            <PlusCircle className="w-4 h-4 mr-2" />
                                            Add Food
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => {
                                        startLoading(); // Start loading
                                        setTimeout(() => setPage('order'), 1000); // Navigate after 1 second
                                    }}
                                    className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            Next <ChevronsRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {page === 'order' && (
                        <motion.div
                            key="order"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-6"
                        >
                            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-4">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold text-white flex items-center gap-2">
                                        <ShoppingCart className="w-6 h-6" />
                                        Your Order
                                    </CardTitle>
                                    <CardDescription className="text-gray-300">
                                        Enter your name and select the food items.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <Input
                                            type="text"
                                            placeholder="Your Name"
                                            value={currentOrder.personName}
                                            onChange={(e) => setCurrentOrder({ ...currentOrder, personName: e.target.value })}
                                            className="bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500"
                                        />
                                        {foodItems.map((food) => (
                                            <div key={food.id} className="flex items-center justify-between gap-4">
                                                <span className="text-white">{food.name}</span>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={quantities[food.id] || 0}
                                                    onChange={(e) => handleQuantityChange(food.id, parseInt(e.target.value, 10))}
                                                    className="w-20 bg-black/20 text-white border-purple-500/30 placeholder:text-gray-500"
                                                    placeholder="Qty"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex gap-4">
                                        <Button
                                            onClick={() => {
                                                // Create a new order object with the selected quantities.
                                                const orderedItems = foodItems.map(food => {
                                                    const quantity = quantities[food.id] || 0;
                                                    return {
                                                        ...food,
                                                        quantity: quantity,
                                                    };
                                                }).filter(item => item.quantity > 0); // Remove items with 0 quantity

                                                const newTotal = orderedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                                                // Update the current order.
                                                setCurrentOrder(prev => ({
                                                    ...prev,
                                                    foodItems: orderedItems,
                                                    totalAmount: newTotal
                                                }));
                                                handlePlaceOrder()
                                            }}
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                                            disabled={!currentOrder.personName.trim()}
                                        >
                                            Confirm Order
                                        </Button>
                                        <Button
                                            onClick={handleNextPerson}
                                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"

                                        >
                                            Next Person
                                        </Button>
                                        <Button
                                            onClick={handleViewSummary}
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                                        >
                                            View Summary
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {page === 'summary' && (
                        <motion.div
                            key="summary"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <SummaryPage orders={orders} onBack={goToOrderPage} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FoodOrderApp;

