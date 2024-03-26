import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from "../firebase";
import "./CommentComp.css"

function CommentComp({ commentHistory }) {

    const { eventId } = useParams(); // get eventId for parameter within url
    const [inputValue, setInputValue] = useState('');
    const [comments, setComments] = useState(commentHistory) // set comments as the event's current commentHistory


    /*
    handleSendComment
    Button press to send comment to chat history. No live update for users.
    Sends new comment to backend and updates frontend view for users.
    Comments cannot be sent without a userEmail, ensuring unsigned in users cannot send emails. Comments cannot be empty strings.
    Comments are trimmed to ensure excess whitespace is not sent as well.

    Params: inputValue : String (user input), event information, userId : String
    Returns: Updates chat history with new message
    */

    const handleSendComment = async (e) => {
        e.preventDefault();
        setInputValue(inputValue.trim()) // Trim excess whitespace
        if (inputValue !== "") { // Check if input is an empty string, if so, do not send.
            const user = auth.currentUser;
            const userEmail = user ? user.email : null; // Get signed in user's email
            if (userEmail === null) { // Ensure user is signed in
                console.log("User not signed in, could not send message")
            }
            else {
                const newComment = { // Format for new comment
                    userEmail: userEmail,
                    message: inputValue
                }
                try {
                    const response = await fetch(`http://localhost:8000/api/eventById/${eventId}`, { // Call to backend with eventId to update proper event
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newComment)
                    })
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    setComments((prevComments) => [...comments, newComment]); // Append new comment to comments state
                } catch (error) {
                console.error("Error fetching event", error);
                }
                setInputValue('');
            }
        }
        
    }

    // useEffect to update user comments whenever commentHistory changes
    useEffect(() => {
        setComments(commentHistory)
    }, [commentHistory]);


    return (
        <div className='comments-section'>
            <h2>Chat Box</h2>
            <div>
            {Array.isArray(comments) &&
                comments.map((comment, index) => (
                    <div key={index}>
                        <p>{comment.userEmail}: {comment.message}</p>
                    </div>
                ))
            }
            </div>
            <form onSubmit={handleSendComment}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
            />
            <button type="submit">Send</button>
            </form>
      </div>
    );
}

export default CommentComp;