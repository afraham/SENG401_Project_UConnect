import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from "../firebase";

function CommentComp() {

    const { eventId } = useParams();
    const [inputValue, setInputValue] = useState('');
    const [comments, setComments] = useState([])

    useEffect(() => {
        // This useEffect is moreso temporary, depending on how event page is implemented. May just pass event as a prop. Add to useState if so.
        const fetchEventById = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/eventById/${eventId}`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                const event = await response.json();
                setComments(event.comments); // Assuming data is an array of events
            } catch (error) {
            console.error("Error fetching event", error);
            }
        }

        fetchEventById();
    }, []);

    const handleSendComment = async (e) => {
        e.preventDefault();
        setInputValue(inputValue.trim())
        if (inputValue !== "") {
            const user = auth.currentUser;
            const userEmail = user ? user.email : null;
            if (userEmail === null) {
                console.log("User not signed in, could not send message")
            }
            else {
                const newComment = {
                    userEmail: userEmail,
                    message: inputValue
                }
                try {
                    const response = await fetch(`http://localhost:8000/api/eventById/${eventId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newComment)
                    })
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    setComments((prevComments) => [...comments, newComment]);
                } catch (error) {
                console.error("Error fetching event", error);
                }
                setInputValue('');
            }
        }
        
    }


    return (
        <div>
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