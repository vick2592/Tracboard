'use client'

const Dashboard = ({ params }) => {
    const address = params?.address;

  return (
    <>
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Moralis Powered Dashboard</h1>
        <p className="text-neutral">
        {address} 
        </p>
      </div>
    </>
  );
};

export default Dashboard;