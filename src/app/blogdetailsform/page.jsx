"use client"
import React, { useState } from 'react'
import './blogForm.css'
import { handleCompletion } from '@/actions'
import { marked } from 'marked'

const BlogDetailForm = () => {
  const [metaData, setMetadata] = useState({
    topic: "",
    authorName: "",
    authorImage: null,
    keywords: ["", "", "", "", ""],
    avatarPreview: ""
  })
  const [blogData, setBlogData] = useState({ title: "", content: "" })
  const [blogDisplayOff, setBlogDisplayOff] = useState(true)

  const handleChange = (event) => {
    const { name, value } = event.target
    setMetadata(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleKeywordChange = (index, value) => {
    const newKeywords = [...metaData.keywords]
    newKeywords[index] = value
    setMetadata(prevState => ({
      ...prevState,
      keywords: newKeywords
    }))
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setMetadata(prevState => ({
        ...prevState,
        authorImage: file,
        avatarPreview: reader.result
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = {
      topic: metaData.topic,
      keywords: metaData.keywords
    }
    const dataObjectReceived = await handleCompletion(formData)
    console.log("Data received from API:", dataObjectReceived) // Debugging line

    try {
      const jsonString = dataObjectReceived.match(/```json([\s\S]*?)```/)[1].trim()
      const blogContent = JSON.parse(jsonString)
      setBlogData(blogContent)
      setBlogDisplayOff(false)
    } catch (error) {
      console.error("Error parsing JSON:", error)
    }
  }

  return (
    <div className='container'>
      <form className='blogForm' onSubmit={handleSubmit}>
        <label htmlFor="topic">Topic:</label>
        <input
          type="text"
          name='topic'
          id='topic'
          placeholder='Enter topic for the blog...'
          value={metaData.topic}
          onChange={handleChange}
        />
        <label htmlFor="authorName">Author Name:</label>
        <input
          type="text"
          name='authorName'
          id='authorName'
          placeholder='Enter author name for the blog...'
          value={metaData.authorName}
          onChange={handleChange}
        />
        <div className="avatarUploadContainer">
          <div>
            <label htmlFor="authorAvatar">Author Avatar:</label>
            <input
              type="file"
              name='authorAvatar'
              id='authorAvatar'
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          {metaData.avatarPreview && <img src={metaData.avatarPreview} alt="Author Avatar" className="avatarImage" />}
        </div>
        {metaData.keywords.map((keyword, index) => (
          <div key={index}>
            <label htmlFor={`keyword${index + 1}`}>Keyword{index + 1}:   </label>
            <input
              type="text"
              name={`keyword${index + 1}`}
              id={`keyword${index + 1}`}
              placeholder={`Enter keyword ${index + 1}...`}
              value={keyword}
              onChange={(e) => handleKeywordChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="submit">Generate Blog</button>
      </form>

      <div className="blogContainer">
        {blogDisplayOff ? "" :
          <>
            <h2>Title : {blogData.title}</h2>
            <h4>Author:</h4>
            <div className="authorContainer">
              <img src={metaData.avatarPreview ? metaData.avatarPreview : '/avatar.png'} alt="Author Avatar" className="avatarImage" />
              <h4>{metaData.authorName}</h4>
            </div>  
            <h4>Keywords : {metaData.keywords.filter(keyword => keyword).join(', ')}</h4>
            <h3>Content:</h3>
            <div dangerouslySetInnerHTML={{ __html: marked(blogData.content) }}></div>
          </>
        }
      </div>
    </div>
  )
}

export default BlogDetailForm
