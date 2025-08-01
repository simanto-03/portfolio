"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Comments({ title }) {
    const [comments, setComments] = useState([]);
    const [name, setName] = useState("");
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [reply, setReply] = useState("");
    const [replyName, setReplyName] = useState("");    

    useEffect(() => {
        async function fetchComments() {
            const res = await fetch(`/api/blog/${encodeURIComponent(title)}`);
            const data = await res.json();
            setComments(data.comments || []);
        }
        fetchComments();
    }, [title]);

    const submitComment = async (e) => {
        e.preventDefault();
        try {
            if (!newComment.trim()){
                toast.error("Write Something!");
                return;
            }

            const res = await fetch(`/api/blog/${encodeURIComponent(title)}/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: name ? name : "Anonymous",
                    content: newComment,
                    parentCommentId: replyTo,
                }),
            });

            const updatedComments = await res.json();
            setComments(updatedComments);
            setNewComment("");
            setName("");
            setReplyTo(null);
            toast.success("Your comment is Saved!");
        } catch (error) {
            toast.error("Something went wrong! Please, try again.");
        }
    };

    const submitReply = async (e) => {
        e.preventDefault();
        try {
            if (!reply.trim()){
                toast.error("Write Something!");
                return;
            }

            const res = await fetch(`/api/blog/${encodeURIComponent(title)}/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: name ? name : "Anonymous",
                    content: reply,
                    parentCommentId: replyTo,
                }),
            });

            const updatedComments = await res.json();
            setComments(updatedComments);
            setReply("");
            setReplyName("");
            setReplyTo(null);
            toast.success("Your reply is saved!");
        } catch (error) {
            toast.error("Something went wrong! Please, try again.");
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <form onSubmit={submitComment} className="mb-4 flex flex-col gap-2 text-black">
                <input 
                    type="text" 
                    placeholder="Your Name (optional)" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <textarea
                    className="w-full p-2 border rounded mb-2"
                    rows={3}
                    placeholder={"Write a comment..."}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Comment
                </button>
            </form>

            <div className="mt-8 space-y-4">
                {comments.map((comment, i) => (
                    <div key={i} className="border border-black dark:border-white p-4 rounded">
                        <p className="font-semibold">{comment.user}</p>
                        <p>{comment.content}</p>
                        <button
                            onClick={() => setReplyTo(comment._id)}
                            className="text-sm text-blue-500 mt-2"
                        >
                            Reply
                        </button>

                        {replyTo && (
                            <form onSubmit={submitReply} className="mb-4 flex flex-col gap-2 text-black">
                                <input 
                                    type="text" 
                                    placeholder="Your Name (optional)" 
                                    value={replyName} 
                                    onChange={(e) => setReplyName(e.target.value)}
                                    className="w-full p-2 border rounded mb-2"
                                />
                                <textarea
                                    className="w-full p-2 border rounded mb-2"
                                    rows={3}
                                    placeholder={"Write a reply..."}
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Reply
                                </button>
                            </form>
                        )}

                        {comment.replies?.map((reply, j) => (
                            <div
                                key={j}
                                className="ml-6 mt-3 p-3 border-l border-gray-300 bg-gray-100 dark:bg-gray-800 rounded"
                            >
                                <p className="font-semibold">{reply.user}</p>
                                <p>{reply.content}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
