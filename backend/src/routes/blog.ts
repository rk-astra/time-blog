import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { createBlogInput, updateBlogInput } from "@learn_rk/medium-common";

export const blogRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    },
    Variables: {
        userId: any;
    }
}>();

blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
    if(user) {
        c.set('userId',user.id)
        await next();
    } else {
        c.status(403);
        return c.json({
            message: "You are not logged in.",
        })
    }
    } catch (error) {
        c.status(403);
        return c.json({
            message: "You are not logged in.",
        })
    }
});

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const userId = c.get('userId');
    const { success } = createBlogInput.safeParse(body);
    if(!success){
        c.status(411);
      return c.json({
        message: "Inputs are incorrect.",
      });
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.blog.create({
            data: {
                authorId: userId,
                title: body.title,
                content: body.content,
                // published: body.published
            }
        });
        // console.log(blog);

        return c.json({
            message: " Blog created successfully",
            id: blog.id
        })
    } catch (error) {
        console.log(error);
        return c.text("some error occured");
    }
})
  
blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if(!success){
        c.status(411);
      return c.json({
        message: "Inputs are incorrect.",
      });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.blog.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content,
                // published: body.published
            }
        });
        // console.log(blog);

        return c.json({
            message: " Blog updated successfully",
        })
    } catch (error) {
        console.log(error);
        return c.text("some error occured");
    }
    
})
  
//todo: add pagination
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blogs = await prisma.blog.findMany({
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return c.json({
            message: "Request successful",
            blogs,
        })
    } catch (error) {
        console.log(error);
        return c.text("some error occured");
    }
})

 blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: Number(id),
            },
            select: {
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });
        // console.log(blog);

        return c.json({
            message: " Blog retrieved successfully",
            blog: blog
        })
    } catch (error) {
        console.log(error);
        c.status(411);
        return c.text("some error occured");
    }
})
  


  