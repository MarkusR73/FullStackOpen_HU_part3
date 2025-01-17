const Added = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='added'>
        {message}
      </div>
    )
  }

  const Error = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

export {Added, Error}