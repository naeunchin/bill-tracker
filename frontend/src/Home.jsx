import bank from './assets/bank.jpg'

function Home() {
    return (
        <div className="text-center mt-5">
            <h1>Welcome to Bill Tracker</h1>
            <h3>View and manage your bills in this easy-to-use application!</h3>
            <img 
                src={bank} 
                alt="A cartoon image of a piggy bank." 
                className="img-fluid mt-4" 
                style={{ maxWidth: '400px' }} 
            />
        </div>
    );
}
export default Home;