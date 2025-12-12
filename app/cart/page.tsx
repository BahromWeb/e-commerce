"use client";

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, removeFromCart, updateQuantity, clearCart } from "@/lib/store";
import { Header } from "@/components/header";
import { message } from 'antd';
import Image from "next/image";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const [messageApi, contextHolder] = message.useMessage();

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    if (quantity > 99) {
      messageApi.warning('Maksimal miqdor 99 ta');
      return;
    }
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
    messageApi.success('Mahsulot savatchadan olib tashlandi');
  };

  const handleClearCart = () => {
    if (window.confirm("Savatchani tozalashni xohlaysizmi?")) {
      dispatch(clearCart());
      messageApi.success('Savat muvaffaqiyatli tozalandi');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Xarid Savati</h1>

          {items.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FiShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2 text-gray-900">Savatingiz bo'sh</h2>
              <p className="text-gray-600 mb-6">Boshlash uchun mahsulot qo'shing</p>
              <button
                onClick={() => router.push("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors"
              >
                Xaridni Davom Ettirish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="bg-gray-50 w-full sm:w-28 h-28 rounded flex items-center justify-center shrink-0 p-3">
                        <Image 
                          src={item.product.image} 
                          alt={item.product.title} 
                          width={100}
                          height={100}
                          className="object-contain h-full w-auto"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base mb-2 text-gray-900 line-clamp-2">{item.product.title}</h3>
                        <p className="text-gray-500 text-sm capitalize mb-2">
                          {item.product.category}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
                        <div className="flex items-center gap-2 bg-gray-100 rounded p-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 rounded bg-white hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-300"
                          >
                            <FiMinus />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 rounded bg-white hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-300"
                          >
                            <FiPlus />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                        >
                          <FiTrash2 /> O'chirish
                        </button>
                        <p className="font-semibold text-base text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-6 text-gray-900">Buyurtma Xulasasi</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Jami Mahsulotlar:</span>
                      <span className="font-medium text-gray-900">{totalItems}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mahsulotlar:</span>
                      <span className="font-medium text-gray-900">{items.length}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Jami:</span>
                      <span className="text-xl font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-colors mb-3"
                  >
                    Xaridni Davom Ettirish
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded transition-colors"
                  >
                    Savatni Tozalash
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
