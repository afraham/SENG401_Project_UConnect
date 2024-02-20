import React, { useState } from 'react';
import './AddEvents.css'; // You will create this CSS file for styling the popup

const AddEvents = ({ closePopup }) => {


    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [maxPeople, setMaxPeople] = useState(2);
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');

    // Function to increment maxPeople
    const incrementPeople = () => {
        setMaxPeople(prev => prev + 1);
    };

    // Function to decrement maxPeople
    const decrementPeople = () => {
        setMaxPeople(prev => prev > 2 ? prev - 1 : 2);
    };


    // This is just a test pls remove it when database is set up
    const saveEventData = () => {
        
        if (!title.trim() || !description.trim() || !date.trim() || !location.trim()) {
            alert('Please fill in all fields.');
            return; // Stop the function if any field is empty
        }

        console.log({
            title,
            description,
            maxPeople,
            date,
            location
        });

        closePopup();
    };
    //..................


    return (
        <div className="popup-container">
            <div className="popup-content">
                <h2>Add New Event</h2>
                <button className="close-button" onClick={closePopup}>X</button>
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} /> {/*Title Box*/}
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /> {/* Descr Box*/}
                <div className="max-people"> {/*No. of People*/}
                    <button onClick={decrementPeople}>-</button>
                    <span>{maxPeople}</span>
                    <button onClick={incrementPeople}>+</button>
                </div>
                <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
                <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                <div className="create-button-container">
                    <button className="create-button" onClick={saveEventData}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEvents;
