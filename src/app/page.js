import Chatbot from '@/components/Chatbot/Chatbot';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', color: '#334155', padding: '20px' }}>
      <div style={{ maxWidth: '800px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' }}>VaultOfCourse</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#475569' }}>
          Welcome to the VaultOfCourse learning platform. We offer premium courses and internships to accelerate your career.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '40px' }}>
          <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>Premium Courses</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Explore our Ethical Hacking, Python, and Full Stack programs.</p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>Internships</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Gain real-world experience with our internship opportunities.</p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>Verified Certificates</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Earn industry-recognized certificates upon completion.</p>
          </div>
        </div>

        <p style={{ marginTop: '40px', fontSize: '1rem', fontStyle: 'italic', color: '#94a3b8' }}>
          Need help? Click the chat icon in the bottom right to talk to our AI Support Assistant!
        </p>
      </div>

      <Chatbot />
    </main>
  );
}
