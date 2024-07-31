import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export const Blogs = () => {
    const { loading, blogs } = useBlogs();

    if (loading) {
        return <div>
            <Appbar /> 
            <div  className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }

    return <div>
        <Appbar />
        <div  className="flex justify-center">
            <div>
                {blogs.map(blog => <BlogCard
                    key = {blog.id}
                    id={blog.id}
                    authorName={ blog.author.name || "Anonymous" }
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"2nd Feb 2024"}
                />)}
            </div>
        </div>
    </div>
}




{/* <BlogCard 
authorName="Rakshit" 
title="First Blog that makes sence" 
content="First Blog Content definately not enough but a really good start and there is only going up from here and hence this my way to success and will definately yeild good." 
publishedDate="17-07-2024" 
/>
<BlogCard 
authorName="Rakshit" 
title="Second Blog that makes confirmes this" 
content="First Blog Content definately not enough but a really good start and there is only going up from here and hence this my way to success and will definately yeild good. And I assure you this that i will definately conqure all of this one day and be amongst the top 1% of CS-IT professionals." 
publishedDate="17-07-2024" 
/> */}