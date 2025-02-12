import React from 'react'

import { Post } from '../components/Post'
import { useParams } from 'react-router-dom'
import axios from '../axios'
import parse from 'html-react-parser'
import { jwtDecode } from 'jwt-decode'

export const FullPost = () => {
	const { id } = useParams()
	const [data, setData] = React.useState()
	const [isLoading, setLoading] = React.useState(true)
	const [avatarUrl, setAvatarUrl] = React.useState('')
	const [myUserId, setMyUserId] = React.useState('')
	const [plainText, setPlainText] = React.useState('')

	React.useEffect(() => {
		axios
			.get(`/posts/${id}`)
			.then(res => {
				setData(res.data, data)
				setPlainText(parse(res.data.text))
				setLoading(false)
			})
			.catch(err => {
				alert('Ошибка просмотра статьи')
			})
		const token = localStorage.getItem('token')
		if (token) {
			try {
				const decodedToken = jwtDecode(token)
				setAvatarUrl(decodedToken.avatar_url)
				setMyUserId(decodedToken.user_id)
			} catch (error) {
				console.error('Ошибка декодирования токена:', error)
			}
		}
	}, [])

	if (isLoading) {
		return <Post isLoading={isLoading} />
	}

	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						width: '80%',
					}}
				>
					<Post
						id={data.post_id}
						title={data.title}
						imageUrl={data.image_url}
						user={data.user}
						createdAt={data.created_at}
						viewsCount={data.views_count}
						tags={data.tags}
						isFullPost
					>
						{plainText}
					</Post>
				</div>
			</div>
			\
		</>
	)
}
