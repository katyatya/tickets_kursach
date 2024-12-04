export const create = async (req, res, client) => {
	try {
		const newPost = client.query(
			`INSERT INTO posts_users (post_id,user_id) values ($1,$2) RETURNING *`,
			[req.body.post_id, req.body.user_id]
		)

		res.json({
			...(await newPost).rows[0],
		})
	} catch (err) {
		return res.status(500).json(err.message)
	}
}
export const getAll = async (req, res, client) => {
	try {
		const posts = await client.query(
			`SELECT *  FROM posts 
`
		)
		return res.json(posts.rows)
	} catch (err) {}
	return res.status(404).json({
		message: 'error',
	})
}
export const getLastTags = async (req, res, client) => {
	try {
		const tags = await client.query(
			`WITH tags_from_posts AS (
    SELECT DISTINCT unnest(tags) AS tag, p.views_count
    FROM posts p
    LIMIT 20
)
SELECT t.tag, SUM(t.views_count) AS total_views
FROM tags_from_posts t
GROUP BY t.tag
ORDER BY total_views DESC;

    `
		)
		const tagArray = tags.rows.map(row => row.tag)
		return res.json(tagArray)
	} catch (err) {
		return res.status(404).json(err)
	}
}
export const getOne = async (req, res, client) => {
	try {
		const result = await client.query(
			`UPDATE posts
			 SET views_count = views_count + 1
			 WHERE post_id = $1
			 RETURNING 
 			 *
      `,
			[req.params.id]
		)
		if (result.rows.length == 0) {
			res.status(404).json({
				message: 'Статья не найдена',
			})
		}
		res.json(result.rows[0])
	} catch (err) {
		console.warn(err)
		res.status(500).json({
			message: 'Не удалось просмотреть пост',
		})
	}
}
export const remove = async (req, res, client) => {
	try {
		await client.query(
			` DELETE FROM posts_users
        WHERE post_id = $1 AND user_id=$2`,
			[req.query.post_id, req.query.user_id]
		)
		res.json({
			message: 'success',
		})
	} catch (err) {
		console.warn(err)
		res.status(500).json({ message: 'Ошибка удаления' })
	}
}

export const getPostsByTag = async (req, res, client) => {
	try {
		const posts = await client.query(
			`SELECT * FROM 
    posts 
WHERE  tags @> ARRAY[$1]`,
			[req.params.name]
		)

		res.json(posts.rows)
	} catch (err) {
		res.status(505).json(err.message)
	}
}
