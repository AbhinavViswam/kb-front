import React, { useContext, useEffect, useState } from "react";
import axios from "../Config/axios";
import { useNavigate } from "react-router-dom";
import { BoardContext } from "../context/BoardContext";

function Board() {
    const [boards, setBoards] = useState([]);
    const [title, setTitle] = useState("");
    const [selectBoard, setSelectBoard] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setBoardId } = useContext(BoardContext);

    useEffect(() => {
        if (selectBoard) {
            setBoardId(selectBoard);
            navigate("/list");
        }
    }, [selectBoard]);

    const fetchBoards = async () => {
        let res = await axios.get("/api/boards");
        setBoards(res.data.boards);
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/boards", { title });
            setTitle("");
            setIsModalOpen(false);
            fetchBoards();
        } catch (error) {
            console.error("Error creating board:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">KANBAN BOARD</h1>

            <div className="w-full max-w-5xl">
                {boards.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {boards.map((b, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectBoard(b._id)}
                                className="bg-white shadow-md p-5 rounded-lg w-full text-lg font-semibold flex items-center justify-between hover:bg-blue-100 transition duration-200"
                            >
                                {b.title}
                                <span className="text-gray-500 text-sm">→</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-lg text-center">Create a board to start</p>
                )}
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
            >
                + Create Board
            </button>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a New Board</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Board Title"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition flex items-center justify-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5 mr-2 text-white"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8H4z"
                                                ></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        "Create"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Board;
