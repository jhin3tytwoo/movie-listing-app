export interface Movie {
	id: number;
	title: string;
	titleTh: string;
	year: number;
	genre: string[];
	director: string;
	cast: string[];
	rating: number;
	duration: number;
	poster: string;
	description: string;
	descriptionTh: string;
}

export const movies: Movie[] = [
	{
		id: 1,
		title: 'The Shawshank Redemption',
		titleTh: 'การไถ่ถอนแห่งชอว์แชงค์',
		year: 1994,
		genre: ['Drama'],
		director: 'Frank Darabont',
		cast: ['Tim Robbins', 'Morgan Freeman'],
		rating: 9.3,
		duration: 142,
		poster: 'https://i.pinimg.com/1200x/08/6f/fe/086ffeccab22baa2b4d49ab8787f9b90.jpg',
		description:
			'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
		descriptionTh: 'ชายสองคนที่ถูกจำคุกได้สร้างมิตรภาพ และค้นพบความหวังผ่านการกระทำที่ดีงามธรรมดาๆ'
	},
	{
		id: 2,
		title: 'The Godfather',
		titleTh: 'เดอะ ก็อดฟาเธอร์',
		year: 1972,
		genre: ['Crime', 'Drama'],
		director: 'Francis Ford Coppola',
		cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
		rating: 9.2,
		duration: 175,
		poster: 'https://i.pinimg.com/1200x/3a/2d/34/3a2d34f0a80d0a462ed5b953df963a3e.jpg',
		description:
			'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
		descriptionTh: 'หัวหน้าครอบครัวมาเฟียที่แก่ชราต้องส่งต่ออำนาจให้กับลูกชายที่ไม่เต็มใจ'
	},
	{
		id: 3,
		title: 'The Dark Knight',
		titleTh: 'แบทแมน อัศวินรัตติกาล',
		year: 2008,
		genre: ['Action', 'Crime', 'Drama'],
		director: 'Christopher Nolan',
		cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
		rating: 9.0,
		duration: 152,
		poster: 'https://i.pinimg.com/736x/6a/aa/68/6aaa6840d49861c972d4882dda552cb4.jpg',
		description:
			'When the menace known as the Joker emerges, he plunges Gotham into anarchy and forces Batman closer to crossing the line between hero and vigilante.',
		descriptionTh:
			'เมื่อโจ๊กเกอร์ปรากฏตัว เขาทำให้เมืองก็อธแธมตกอยู่ในความวุ่นวาย และบังคับให้แบทแมนต้องเข้าใกล้เส้นแบ่งระหว่างฮีโร่กับนักสู้นอกกฎหมาย'
	},
	{
		id: 4,
		title: 'Pulp Fiction',
		titleTh: 'พัลป์ ฟิคชั่น',
		year: 1994,
		genre: ['Crime', 'Drama'],
		director: 'Quentin Tarantino',
		cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
		rating: 8.9,
		duration: 154,
		poster: 'https://i.pinimg.com/1200x/89/41/e7/8941e71464be8fe81ade92a86817338e.jpg',
		description:
			'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
		descriptionTh:
			'ชีวิตของนักฆ่ามาเฟียสองคน นักมวย นักเลงและภรรยาของเขาที่เชื่อมโยงกันในสี่เรื่องราวแห่งความรุนแรงและการไถ่ถอน'
	},
	{
		id: 5,
		title: 'Forrest Gump',
		titleTh: 'ฟอร์เรสท์ กัมพ์',
		year: 1994,
		genre: ['Drama', 'Romance'],
		director: 'Robert Zemeckis',
		cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
		rating: 8.8,
		duration: 142,
		poster: 'https://i.pinimg.com/736x/a8/39/7d/a8397dcfdf56fc342c3712a91e186575.jpg',
		description:
			'The presidencies of Kennedy and Johnson, Vietnam, Watergate, and other history unfold through the perspective of an Alabama man.',
		descriptionTh: 'เหตุการณ์สำคัญในประวัติศาสตร์อเมริกาผ่านมุมมองของชายคนหนึ่งจากอลาบามา'
	},
	{
		id: 6,
		title: 'Inception',
		titleTh: 'จิตพิฆาตโลก',
		year: 2010,
		genre: ['Action', 'Sci-Fi', 'Thriller'],
		director: 'Christopher Nolan',
		cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
		rating: 8.8,
		duration: 148,
		poster: 'https://i.pinimg.com/1200x/b0/ae/a4/b0aea49646879a043ad9f6ec3002e99f.jpg',
		description:
			"A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into a CEO's mind.",
		descriptionTh:
			'หัวขโมยที่ขโมยความลับของบริษัทผ่านเทคโนโลยีการแบ่งปันความฝัน ได้รับมอบหมายให้ทำงานตรงกันข้าม คือการปลูกฝังความคิดเข้าไปในจิตใจของซีอีโอ'
	}
];

export function getMovieById(id: number): Movie | undefined {
	return movies.find((movie) => movie.id === id);
}

export function getMoviesByGenre(genre: string): Movie[] {
	return movies.filter((movie) => movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()));
}

export function searchMovies(query: string): Movie[] {
	const searchTerm = query.toLowerCase();
	return movies.filter(
		(movie) =>
			movie.title.toLowerCase().includes(searchTerm) ||
			movie.titleTh.toLowerCase().includes(searchTerm) ||
			movie.director.toLowerCase().includes(searchTerm) ||
			movie.cast.some((actor) => actor.toLowerCase().includes(searchTerm))
	);
}
