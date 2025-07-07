import React from 'react'
import PropTypes from 'prop-types'

const ErrorMessage = ({message}) => {
  return (
    <p className="text-red-500 text-sm mt-2">
      {message}
    </p>
  )
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
}

export default ErrorMessage