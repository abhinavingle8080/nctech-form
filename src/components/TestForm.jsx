import React, {useEffect, useState} from 'react';
import '../styles/TestForm.css'
import {CountdownCircleTimer} from 'react-countdown-circle-timer';
import emailjs from '@emailjs/browser';
import axios from "axios";

//------------------------------------------------------------------------
//constants
import CorrectAnswers from "../constants/CorrectAnswers";


export default function TestForm() {
    const [timeRemaining, setTimeRemaining] = useState(600);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [isTimerStarted, setIsTimerStarted] = useState(false);
    const [isTimerOver, setIsTimerOver] = useState(false);
    const [isTestSeen, setIsTestSeen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [pageVisible, setPageVisible] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: '',
        q6: '',
        q7: '',
        q8: '',
        q9: '',
        q10: '',
        time: 0,
        result: 0
    });

    const correctAnswers = {
        q1: CorrectAnswers.q1,
        q2: CorrectAnswers.q2,
        q3: CorrectAnswers.q3,
        q4: CorrectAnswers.q4,
        q5: CorrectAnswers.q5,
        q6: CorrectAnswers.q6,
        q7: CorrectAnswers.q7,
        q8: CorrectAnswers.q8,
        q9: CorrectAnswers.q9,
        q10: CorrectAnswers.q10,
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});

        validateField(name, value);
        if (errors[name]) {
            setErrors({...errors, [name]: ''});
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsTestSeen(false);
        setIsTimerStarted(false);
        Object.keys(correctAnswers).forEach((question) => {
            if (formData[question] === correctAnswers[question]) {
                formData.result = (Number)(formData.result + 1);
            }
        });

        formData.time = (600 - timeRemaining);
        // setFormData({...formData,time: (timeRemaining)})
        alert('Form submitted. Time remaining: ' + timeRemaining);
        console.log('Form submitted. Time remaining: ' + timeRemaining);
        try {
            const response = await axios.post('https://sheetdb.io/api/v1/4h45jinzc2j7w', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.status === 201 || response.status === 200) {
                console.log('Submission successful');
                setIsSubmitted(true);
                setPageVisible(false);
                // sendEmail();
            } else {
                console.error('Submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const isValidUser = async () => {
        try {
            const response = await axios.get('https://sheetdb.io/api/v1/4h45jinzc2j7w', formData, {
                headers: {


                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const users = response.data;


                for (const user of users) {
                    if (user.email === formData.email) {

                        alert('Response already submitted as ' + formData.email);
                        setIsSubmitted(true);
                        setIsLoggedIn(false);
                        return false;
                    }
                }
                return true;
            } else {
                console.error('fetching Users Failed');
            }
        } catch (error) {
            console.error('Error:', error);

        }
    }

    const startTimer = async () => {
        const userCheck = await isValidUser();
        console.log(userCheck);
        if (userCheck) {
            setIsLoggedIn(true);
            const validationErrors = validateField();

            if (Object.keys(validationErrors).length === 0) {

                alert('Test Started');
                setIsTestSeen(true);
                setIsTimerStarted(true);
            } else {
                setErrors(validationErrors);
            }
        }
    };


    const onTick = () => {

        if (timeRemaining > 0) {
            setTimeRemaining(timeRemaining - 1);
        } else {
            setIsTimerOver(true);
        }
    };
    useEffect(() => {
        if (isTimerOver) {
            handleSubmit();
        }
    }, [isTimerOver]);


    useEffect(() => {
        let timer;
        if (isTimerStarted && timeRemaining > 0) {
            timer = setTimeout(onTick, 1000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [isTimerStarted, timeRemaining]);

    const sendEmail = () => {
        const emailService = 'service_t33fhl5';
        const emailTemplate = 'template_7eak69o';
        const publicKey = 'FOAVB-jIi70KcBSWP';

        const templateParams = {
            from_name: 'Non Criterion Technology',
            to_email: formData.email,
            to_name: formData.name,
        }

        emailjs
            .send(emailService, emailTemplate, templateParams, publicKey)
            .then((response) => {
                console.log('Email sent successfully:', response);
            })
            .catch((error) => {
                console.error('Email sending failed:', error);
            });
    };

    const validateField = () => {
        const errors = {};

        if (formData.name.trim() === '') {
            errors.name = 'Name is required';
        } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
            errors.name = 'Name should only contain letters and spaces';
        }

        if (formData.contact.trim() === '') {
            errors.contact = 'contact number is required';
        } else if (!/^\d{10}$/.test(formData.contact)) {
            errors.contact = 'contact number must be 10 digits';
        }

        if (formData.email.trim() === '') {
            errors.email = 'Email is required';
        } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }

        return errors;
    };

    return (
        <>
            {isTimerStarted && (<div className="timer">
                <CountdownCircleTimer
                    duration={timeRemaining}
                    colors={[['#007bff', 0.33]]}
                    onComplete={handleSubmit}
                    size={200} // Adjust the size of the timer circle
                    strokeWidth={10} // Adjust the thickness of the timer circle
                    isLinearGradient={false} // Disable gradient
                    trailColor="#f0f0f0" // Color of the remaining trail
                    trailStrokeWidth={10} // Thickness of the remaining trail
                    strokeLinecap="butt"
                    onTick={onTick}// Adjust line ending style
                    // Update time left
                >
                    {({remainingTime}) => (
                        <div className="timer-txt">
                            <a>{Math.floor(remainingTime / 60)}:{remainingTime % 60}</a>
                        </div>
                    )}
                </CountdownCircleTimer>
            </div>)}

            <div className="form-body">
                <form className="form">
                    {pageVisible && !isLoggedIn && (
                        <>
                            <div className="student-info">
                                <label htmlFor="name">Name:</label>
                                <input type="text" id="name" name="name" onChange={handleChange} value={formData.name}
                                       required/>
                                {errors.name && (
                                    <div className="error">{errors.name}</div>
                                )}
                                <label htmlFor="email">Email:</label>
                                <input type="text" id="email" name="email" onChange={handleChange}
                                       value={formData.email} required/>
                                {errors.email && (
                                    <div className="error">{errors.email}</div>
                                )}
                                <label htmlFor="contact">Contact No.:</label>
                                <input type="text" id="contact" name="contact" onChange={handleChange}
                                       value={formData.contact} required/>
                                {errors.contact && (
                                    <div className="error">{errors.contact}</div>
                                )}
                                <div className="nav-btn">
                                    <button type="button" className="next-btn" onClick={startTimer}
                                            disabled={isLoggedIn}>Start Test
                                    </button>
                                </div>
                            </div>
                        </>

                    )}

                    {isTestSeen && (
                        <>
                            <div className="c-questions">
                                <h3>Question 1:</h3>
                                <p>What does the break statement do in a C loop?</p>
                                <input type="radio" id="q1_option1" name="q1" onChange={handleChange} value="option1"/>
                                <label htmlFor="q1_option1">Exits the loop and continues with the next
                                    iteration.</label>

                                <input type="radio" id="q1_option2" name="q1" onChange={handleChange} value="option2"/>
                                <label htmlFor="q1_option2">Exits the loop and terminated the loop entirely.</label>

                                <input type="radio" id="q1_option3" name="q1" onChange={handleChange} value="option3"/>
                                <label htmlFor="q1_option3">Continues to the next iteration of the loop.</label>

                                <input type="radio" id="q1_option4" name="q1" onChange={handleChange} value="option4"/>
                                <label htmlFor="q1_option4">Resets the loop to its initial state.</label>

                                <h3>Question 2:</h3>
                                <p>Which of the following data types in C is used to store characters?</p>
                                <input type="radio" id="q2_option1" name="q2" onChange={handleChange} value="option1"/>
                                <label htmlFor="q2_option1">int</label>

                                <input type="radio" id="q2_option2" name="q2" onChange={handleChange} value="option2"/>
                                <label htmlFor="q2_option2">float</label>

                                <input type="radio" id="q2_option3" name="q2" onChange={handleChange} value="option3"/>
                                <label htmlFor="q2_option3">char</label>

                                <input type="radio" id="q2_option4" name="q2" onChange={handleChange} value="option4"/>
                                <label htmlFor="q2_option4">boolean</label>
                                {/*<div className="nav-btn">*/}
                                {/*    <button className="previous-btn">previous</button>*/}
                                {/*    <button type="button" className="next-btn" >Next</button>*/}
                                {/*</div>*/}
                            </div>

                            <div className="java-questions">
                                <h3>Question 3:</h3>
                                <p>What is the correct syntax for declaring a variable in Java?</p>
                                <input type="radio" id="q3_option1" name="q3" onChange={handleChange} value="option1"/>
                                <label htmlFor="q3_option1">variable name = value;</label>

                                <input type="radio" id="q3_option2" name="q3" onChange={handleChange} value="option2"/>
                                <label htmlFor="q3_option2">int = variableName;</label>

                                <input type="radio" id="q3_option3" name="q3" onChange={handleChange} value="option3"/>
                                <label htmlFor="q3_option3">dataType variableName = value;</label>

                                <input type="radio" id="q3_option4" name="q3" onChange={handleChange} value="option4"/>
                                <label htmlFor="q3_option4">value = variableName;</label>

                                <h3>Question 4:</h3>
                                <p>In Java, which keyword is used to create a new instance of a class?</p>
                                <input type="radio" id="q4_option1" name="q4" onChange={handleChange} value="option1"/>
                                <label htmlFor="q4_option1">new</label>

                                <input type="radio" id="q4_option2" name="q4" onChange={handleChange} value="option2"/>
                                <label htmlFor="q4_option2">create</label>

                                <input type="radio" id="q4_option3" name="q4" onChange={handleChange} value="option3"/>
                                <label htmlFor="q4_option3">instance</label>

                                <input type="radio" id="q4_option4" name="q4" onChange={handleChange} value="option4"/>
                                <label htmlFor="q4_option4">instantiate</label>

                                <h3>Question 5:</h3>
                                <p>What is the output of the following Java code snippet?</p>
                                <code>
                                    int x = 5; <br/>
                                    int y = 3;<br/>
                                    System.out.println(x % y);
                                </code>
                                <input type="radio" id="q5_option1" name="q5" onChange={handleChange} value="option1"/>
                                <label htmlFor="q5_option1">2</label>

                                <input type="radio" id="q5_option2" name="q5" onChange={handleChange} value="option2"/>
                                <label htmlFor="q5_option2">1</label>

                                <input type="radio" id="q5_option3" name="q5" onChange={handleChange} value="option3"/>
                                <label htmlFor="q5_option3">0</label>

                                <input type="radio" id="q5_option4" onChange={handleChange} name="q5"
                                       value="option4"/>
                                <label htmlFor="q5_option4">1.6667</label>
                                {/*<div className="nav-btn">*/}
                                {/*    <button type="button"  className="previous-btn">previous</button>*/}
                                {/*    <button type="button"  className="next-btn">Next</button>*/}
                                {/*</div>*/}
                            </div>

                            <div className="database-questions">
                                <h3>Question 6:</h3>
                                <p>What is a primary key in a relational database?</p>
                                <input type="radio" id="q6_option1" onChange={handleChange} name="q6"
                                       value="option1"/>
                                <label htmlFor="q6_option1">A key used to unlock
                                    database access.</label>

                                <input type="radio" id="q6_option2" onChange={handleChange} name="q6"
                                       value="option2"/>
                                <label htmlFor="q6_option2">A unique identifier
                                    for a table record.</label>

                                <input type="radio" id="q6_option3" onChange={handleChange} name="q6"
                                       value="option3"/>
                                <label htmlFor="q6_option3">A table that
                                    stores only primary data.</label>

                                <input type="radio" id="q6_option4"
                                       name="q6" value="option4" onChange={handleChange}/>
                                <label htmlFor="q6_option4">A key used
                                    for sorting database
                                    records.</label>

                                <h3>Question 7:</h3>
                                <p>What does SQL stand for?</p>
                                <input type="radio" id="q7_option1"
                                       name="q7" value="option1" onChange={handleChange}/>
                                <label htmlFor="q7_option1">Structured
                                    Query Language</label>

                                <input type="radio" id="q7_option2"
                                       name="q7" value="option2" onChange={handleChange}/>
                                <label htmlFor="q7_option2">Simple
                                    Query Language</label>

                                <input type="radio"
                                       id="q7_option3" name="q7"
                                       value="option3" onChange={handleChange}/>
                                <label htmlFor="q7_option3">Standard
                                    Query
                                    Language</label>

                                <input type="radio"
                                       id="q7_option4"
                                       name="q7"
                                       value="option4" onChange={handleChange}/>
                                <label htmlFor="q7_option4">Sequential
                                    Query
                                    Language</label>
                                {/*<div className="nav-btn">*/}
                                {/*    <button type="button" className="previous-btn">previous</button>*/}
                                {/*    <button type="button" className="next-btn">Next</button>*/}
                                {/*</div>*/}
                            </div>

                            <div className="apptitude-questions">
                                <h3>Question 8:</h3>
                                <p>If the price of a book is first increased by 20% and then decreased by 20 %. What is
                                    the net
                                    change in the price of the book?</p>
                                <input type="radio"
                                       id="q8_option1"
                                       name="q8"
                                       value="option1" onChange={handleChange}/>
                                <label
                                    htmlFor="q8_option1">No change</label>

                                <input type="radio"
                                       id="q8_option2"
                                       name="q8"
                                       value="option2" onChange={handleChange}/>
                                <label
                                    htmlFor="q8_option2">4% Increase</label>

                                <input
                                    type="radio"
                                    id="q8_option3"
                                    name="q8"
                                    value="option3" onChange={handleChange}/>
                                <label
                                    htmlFor="q8_option3">4% decrease</label>

                                <input
                                    type="radio"
                                    id="q8_option4"
                                    name="q8"
                                    value="option4" onChange={handleChange}/>
                                <label
                                    htmlFor="q8_option4">10% decrease</label>

                                <h3>Question
                                    9:</h3>
                                <p>If 3 workers can complete a task in 8 hours, how many workers are needed to complete
                                    the same
                                    task in
                                    4 hours?</p>
                                <input
                                    type="radio"
                                    id="q9_option1"
                                    name="q9"
                                    value="option1" onChange={handleChange}/>
                                <label
                                    htmlFor="q9_option1">6
                                    workers</label>

                                <input
                                    type="radio"
                                    id="q9_option2"
                                    name="q9"
                                    value="option2" onChange={handleChange}/>
                                <label
                                    htmlFor="q9_option2">12
                                    workers</label>

                                <input
                                    type="radio"
                                    id="q9_option3"
                                    name="q9"
                                    value="option3" onChange={handleChange}/>
                                <label
                                    htmlFor="q9_option3">2
                                    workers</label>

                                <input
                                    type="radio"
                                    id="q9_option4"
                                    name="q9"
                                    value="option4" onChange={handleChange}/>
                                <label
                                    htmlFor="q9_option4">8
                                    workers</label>

                                <h3>Question
                                    10:</h3>
                                <p>If a train travels at a speed of 60 km/h, how many hours will it take to cover a
                                    distance of
                                    240
                                    km?</p>
                                <input
                                    type="radio"
                                    id="q10_option1"
                                    name="q10"
                                    value="option1" onChange={handleChange}/>
                                <label
                                    htmlFor="q10_option1">2
                                    hours</label>

                                <input
                                    type="radio"
                                    id="q10_option2"
                                    name="q10"
                                    value="option2" onChange={handleChange}/>
                                <label
                                    htmlFor="q10_option2">4
                                    hours</label>

                                <input
                                    type="radio"
                                    id="q10_option3"
                                    name="q10"
                                    value="option3" onChange={handleChange}/>
                                <label
                                    htmlFor="q10_option3">3
                                    hours</label>

                                <input
                                    type="radio"
                                    id="q10_option4"
                                    name="q10"
                                    value="option4" onChange={handleChange}/>
                                <label
                                    htmlFor="q10_option4">6
                                    hours</label>
                            </div>
                            <button type="submit" className="submit-btn" onClick={handleSubmit}>Submit</button>
                        </>)}
                    {isSubmitted && (<>
                        <div className="thank-you-container">
                            <h1 className="thank-you-title">Thank You!</h1>
                            <p className="thank-you-message">Your submission has been received.</p>
                            <a href="https://www.noncriteriontechnology.com/?i=1" className="thank-you-link">Visit
                                Website</a>
                        </div>
                    </>)}
                </form>


            </div>
        </>
    )
}
