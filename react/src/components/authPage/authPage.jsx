import React from 'react'
import Home from '../home/home'

export default function AuthPage({close}) {
  return (
    <div className="popup-overlay">
					<div className="popup-content">
						<div className="popup-button">
							<button className="close-button" onClick={close}>
								X
							</button>
						</div>
						<Home />
					</div>
				</div>
  )
}



