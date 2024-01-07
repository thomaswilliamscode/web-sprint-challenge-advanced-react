import React, { useState, useEffect} from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initialLocation = (2,2)

const initialStates = {
  Message: initialMessage,
  Email: initialEmail,
  Steps: initialSteps,
  Index: initialIndex,
  Location: initialLocation
}
const endpoint = 'http://localhost:9000/api/result'

// get move working, 
  // remove active class from old, and add active class to new
// get move messages showing
// get email working
// get email submit working 


export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  // state to track B
  const [ states, SetStates ] = useState(initialStates)

  // useEffect( () => {
  //   console.log('useEffect')
  //   console.log(states.Index)
  // }, [states.Index])

  function getXY(id) {

    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let error = `You can't go`

    if (
			id === 'left' &&
			(states.Index === 0 || states.Index === 3 || states.Index === 6)
		) {
      let newStates = { newMessage: `${error} ${id}` };
			getXYMessage(newStates);
      return 'error'
		} else if (
			id === 'right' &&
			(states.Index === 2 || states.Index === 5 || states.Index === 8)
		) {
			let newStates = { newMessage: `${error} ${id}` };
			getXYMessage(newStates);
      return 'error';
		} else if (
			id === 'up' &&
			(states.Index === 0 || states.Index === 1 || states.Index === 2)
		) {
			let newStates = { newMessage: `${error} ${id}` };
			getXYMessage(newStates);
      return 'error';
		} else if (
			id === 'down' &&
			(states.Index === 6 || states.Index === 7 || states.Index === 8)
		) {
      let newStates = { newMessage: `${error} ${id}` };
			getXYMessage(newStates);
      return 'error';
		} else {
      let newStates = { newMessage: '' }
      getXYMessage(newStates);
    }
    
  }

  function getCords() {
    const cords = [`(1, 1)`,`(2, 1)`,`(3, 1)`,`(1, 2)`,`(2, 2)`,`(3, 2)`,`(1, 3)`,`(2, 3)`,`(3, 3)`];

    let location = cords[states.Index];
    return `Coordinates ${location}`;
  }

  function getXYMessage(newStates) {
    let { Message } = states;
    let { newMessage } = newStates
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    SetStates( (prevStates) => {
      return {...prevStates, Message: newMessage}
    })

  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    SetStates((prevStates => initialStates))
  }
  const Left = states.Index - 1;
	const Right = states.Index + 1;
	const Up = states.Index - 3;
	const Down = states.Index + 3;

  function getNextIndex(direction) {
    
    if (direction === 'left') {
			if (Left >= 0) {
				move(direction);
			}
		} else if (direction === 'right') {
			if (Right >= 0) {
				move(direction);
			}
		} else if (direction === 'up') {
			if (Up >= 0) {
				move(direction);
			}
		} else if (direction === 'down') {
			if (Down >= 0) {
				move(direction);
			}
		} else {
      return `You can't go ${direction}`
    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    // console.log(states)
  }

  function move(id) {
    SetStates((...prevStates) => {
			return { ...prevStates, Steps: states.Steps + 1 };
		});
    if (id === 'left') {
      SetStates( (prevStates) => {
        return { ...prevStates, Index: Left }
      })
    } else if (id === 'right') {
			SetStates((prevStates) => {
				return { ...prevStates, Index: Right };
			});
		} else if (id === 'up') {
      SetStates((prevStates) => {
				return { ...prevStates, Index: Up };
			});
    } else if (id === 'down') {
      SetStates((prevStates) => {
				return { ...prevStates, Index: Down };
			});
    } else {
      console.log('idk bro')
    }
		// This event handler can use the helper above to obtain a new index for the "B",
		// and change any states accordingly.
  }

  function createPayload() {
    console.log(states.Email)
    if (states.Email === undefined) {
      let newStates = { newMessage: 'Ouch: email is required' };
			getXYMessage(newStates);
    } else {
      // `{ "x": 1, "y": 2, "steps": 3, "email": "lady@gaga.com" }`;
    let payload = { x: getX(), y: getY(), steps: states.Steps, email: states.Email}
    let newStates = { newMessage: '' };
		getXYMessage(newStates);
    return payload
    }
    
  }


  function onChange(evt) {
    
    // You will need this to update the value of the input.
    const { id, value } = evt.target
    let error = false
    error = getXY(id)
    if (error === 'error') {
      return 
    } else {
      getNextIndex(id);
    }

    SetStates( (prevStates) => {
      return {...prevStates, Email: value}
    })
    
  }

  function getX() {
    let x = getCords().split('')
    return x[13]

  }

  function getY() {
    let y = getCords().split('');
    return y[16]
  }



  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    let payload = createPayload()
    axios.post(endpoint, payload)
      .then( res => {
        let newStates = { newMessage: `${res.data.message}` };
				getXYMessage(newStates);
      })
      .catch(err => {
        let newStates = { newMessage: `${err.response.data.message}` };
				getXYMessage(newStates);
      })
      SetStates( (prevStates) => {
        return {...prevStates, Email: ''}
      })
      
  }


  return (
		<div id='wrapper' className={props.className}>
			<div className='info'>
				<h3 id='coordinates'>{getCords()}</h3>
				<h3 id='steps'>
					{states.Steps === 1
						? `You moved ${states.Steps} time`
						: `You moved ${states.Steps} times`}
				</h3>
			</div>
			<div id='grid'>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
					<div
						key={idx}
						className={`square${idx === states.Index ? ' active' : ''}`}
					>
						{idx === states.Index ? 'B' : null}
					</div>
				))}
			</div>
			<div className='info'>
				<h3 id='message'>{states.Message}</h3>
			</div>
			<div id='keypad'>
				<button onClick={onChange} id='left'>
					LEFT
				</button>
				<button onClick={onChange} id='up'>
					UP
				</button>
				<button onClick={onChange} id='right'>
					RIGHT
				</button>
				<button onClick={onChange} id='down'>
					DOWN
				</button>
				<button id='reset' onClick={reset}>
					reset
				</button>
			</div>
			<form onSubmit={onSubmit}>
				<input
					onChange={onChange}
					id='email'
					type='email'
					placeholder='type email'
					value={states.Email}
				></input>
				<input id='submit' type='submit'></input>
			</form>
		</div>
	);
}
