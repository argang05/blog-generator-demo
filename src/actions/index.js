"use server"
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function handleCompletion(formData) {
    const blogTopic = formData.topic;
    const blogKeywords = formData.keywords;


    // console.log(blogTopic);
    // console.log(blogKeywords);

    // const prompt = `write a short and simple blog post about ${blogTopic}`;

    // const prompt = `write a short, simple and SEO-friendly blog post about ${blogTopic} considering the keywords: ${blogKeywords}. 
    // The output format must be a JSON object with the following format:
    // {
    //   title : blog post title here,
    //   content : blog post content here
    // }`
    
    const prompt = `write a short, simple and SEO-friendly blog post about ${blogTopic} considering the keywords: ${blogKeywords} in markdown format containing a JSON object with the following format:
    {
        title : blog post title here,
        content : blog post content here
    }
    `

    // console.log(prompt);

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a professional blog post writer" },
                {role : "user" , content : prompt}
            ],
            model: 'gpt-3.5-turbo',
            temperature: 0,
            max_tokens: 500
        })
        const responseData = completion.choices[0].message.content;

        // console.log(responseData);
        // console.log(typeof responseData);
        // console.log(parsedResponseData);
        // console.log(parsedResponseData.title);
        // console.log(parsedResponseData.content);
        // // console.log(typeof responseData)
        // const parsedResponseData = JSON.parse(responseData);
        // return parsedResponseData;
        
        return responseData;
    } catch (err) {
        console.log("Error with OpenAI: ",err);
    }
}

