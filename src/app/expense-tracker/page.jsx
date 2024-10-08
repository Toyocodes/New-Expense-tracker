"use client";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { useAddTransaction } from "../hooks/useAddTransaction";
import { useGetTransactions } from "../hooks/useGetTransaction";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
import { useEditTransaction } from "../hooks/useEditTransaction";
import { useDeleteTransaction } from "../hooks/useDeleteTransaction";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import Loader from "../components/loader";
import Greeting from "../components/greetings";
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from "react-icons/io";
import { useRouter } from "next/navigation";
import { SignedIn, UserButton } from "@clerk/nextjs";

const ExpenseTracker = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState();
  const [transactionType, setTransactionType] = useState("expense");
  const [editMode, setEditMode] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addTransaction } = useAddTransaction();
  const { transactions, transactionTotals, loading } = useGetTransactions();
  const { editTransaction } = useEditTransaction();
  const { deleteTransaction } = useDeleteTransaction();
  const { balance, income, expenses } = transactionTotals;
  const { name, profilePhoto } = useGetUserInfo();

  const onSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      editTransaction(currentTransactionId, {
        description,
        transactionAmount,
        transactionType,
      });
      toast.success("Transaction updated successfully");
      setEditMode(false);
      setCurrentTransactionId(null);
    } else {
      addTransaction({
        description,
        transactionAmount,
        transactionType,
      });
      toast.success(
        transactionType === "expense"
          ? "Expense added successfully"
          : "Income added successfully"
      );
    }

    setDescription("");
    setTransactionAmount(0);
    setTransactionType("expense");
    setIsModalOpen(false);
  };

  const onEdit = (transaction) => {
    setDescription(transaction.description);
    setTransactionAmount(transaction.transactionAmount);
    setTransactionType(transaction.transactionType);
    setEditMode(true);
    setCurrentTransactionId(transaction.id);
    setIsModalOpen(true);
  };

  const onDelete = (transactionId) => {
    deleteTransaction(transactionId);
    toast.success("Transaction deleted successfully");
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  return (
    <div className="pt-4">
      <div className="mx-auto max-w-6xl p-6 bg-white rounded-xl shadow-lg ">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Greeting name={name} />
            <p className="text-gray-500">
              Let&apos;s track today&apos;s expenses 😊
            </p>
          </div>
          <div>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 mr-0 lg:mr-6">
            <div className="bg-purple-900 text-white rounded-xl shadow-lg py-7 px-6 mb-8 text-center">
              <h3 className="text-lg mb-2">Total Balance</h3>
              {loading ? (
                <Loader />
              ) : (
                <h2 className="text-4xl font-bold">
                  {balance >= 0 ? `₦${balance}` : `-₦${balance * -1}`}
                </h2>
              )}
            </div>
            {loading ? (
              <Loader />
            ) : (
              <div className="flex justify-between mb-10 text-center">
                <div className="flex flex-col gap-y-1 items-center p-4 bg-yellow-100 rounded-xl shadow-md flex-1 mx-1">
                  <div className=" bg-green-200 rounded-full p-2">
                    <IoIosArrowRoundDown color="green" size={25} />
                  </div>
                  <h4 className="text-base">Income</h4>
                  <p className="text-2xl font-bold">₦{income}</p>
                </div>
                <div className="flex flex-col gap-y-1 items-center p-4 bg-pink-100 rounded-xl shadow-md flex-1 mx-1">
                  <div className=" bg-red-200 rounded-full p-2">
                    <IoIosArrowRoundUp color="red" size={25} />
                  </div>
                  <h4 className="text-base">Expenses</h4>
                  <p className="text-2xl font-bold">₦{expenses}</p>
                </div>
              </div>
            )}
          </div>

          {/* button */}
          <div className="flex-1 lg:ml-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="mb-8 bg-green-500 text-white py-2 px-3 text-sm rounded-md hover:bg-green-600 transition"
            >
              Add New Expenses
            </button>
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 px-10">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-2 right-2 pt-2 px-4 text-black text-2xl hover:text-red-500"
                  >
                    &times;
                  </button>

                  {/* form */}
                  <form className="mb-4 mt-8" onSubmit={onSubmit}>
                    <input
                      type="text"
                      placeholder="Description"
                      value={description}
                      required
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2 mb-2 border rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={transactionAmount}
                      required
                      onChange={(e) =>
                        setTransactionAmount(Number(e.target.value))
                      }
                      className="w-full p-2 mb-2 border rounded-md"
                    />
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        id="expense"
                        value="expense"
                        checked={transactionType === "expense"}
                        onChange={(e) => setTransactionType(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor="expense" className="mr-4">
                        Expense
                      </label>
                      <input
                        type="radio"
                        id="income"
                        value="income"
                        checked={transactionType === "income"}
                        onChange={(e) => setTransactionType(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor="income">Income</label>
                    </div>
                    <button
                      type="submit"
                      className={`w-full ${
                        editMode ? "bg-yellow-500" : "bg-green-500"
                      } text-white py-2 rounded-md hover:bg-opacity-80 transition mt-4`}
                    >
                      {editMode ? "Update Transaction" : "Add Transaction"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* list of transaction */}
            <h3 className="text-lg lg:text-xl font-bold mb-3">Transactions</h3>
            <div className="transactions overflow-y-auto max-h-[410px]">
              {loading ? (
                <Loader />
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction, index) => {
                    const {
                      description,
                      transactionAmount,
                      transactionType,
                      id,
                      createdAt,
                    } = transaction;
                    return (
                      <div
                        key={index}
                        className={`bg-gray-50 border-l-4 ${
                          transactionType === "expense"
                            ? "border-red-500"
                            : "border-green-500"
                        } p-3 rounded-md shadow-md flex justify-between items-center`}
                      >
                        <div className="flex flex-col gap-y-0.5">
                          <h4 className="font-semibold">{description}</h4>
                          <p>
                            ₦{transactionAmount} •{" "}
                            <span
                              className={
                                transactionType === "expense"
                                  ? "text-red-500"
                                  : "text-green-500"
                              }
                            >
                              {transactionType}
                            </span>
                          </p>
                          <p className="text-gray-400 text-xs">
                            {createdAt ? formatDate(createdAt) : "N/A"}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className=""
                            onClick={() => onEdit(transaction)}
                          >
                            <AiFillEdit size={20} color={"#4CAF50"}/>
                          </button>
                          <button
                            className=""
                            onClick={() => onDelete(id)}
                          >
                            <MdDelete size={20} color={"#FF0000"}/>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
