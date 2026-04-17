import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu } from "react-icons/hi"; // hamburger icon
import { useNavigate } from "react-router-dom";



export default function Dashboard() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editJobId, setEditJobId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

   const userProfile = {
    name: localStorage.getItem("userName") || "Guest",
    email: localStorage.getItem("userEmail") || "guest@example.com",
    avatar: "https://i.pravatar.cc/100",
  };

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
  });

  const token = localStorage.getItem("token");

  // ================= FETCH JOBS =================
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("https://job-tracker-app-wrwz.onrender.com/api/jobs", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ FIX
        });
        const data = await res.json();
        if (res.ok) setJobs(data);
      } catch (error) {
        console.log("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [token]);

  //
  useEffect(()=>{
    if(sidebarOpen){
      document.body.style.overflow="hidden";
    }else{
      document.body.style.overflow="auto"
    }
  },[sidebarOpen])

  // ADD / EDIT JOB 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role) return;

    try {
      let res, data;
      if (editJobId) {
   res = await fetch(`https://job-tracker-app-wrwz.onrender.com/api/jobs/${editJobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

   data = await res.json();
  console.log("Update Response:", data); // DEBUG

  if (res.ok) {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === editJobId ? { ...job, ...formData } : job
      )
    );
  }

  setEditJobId(null);
} else {

        // ADD
        res = await fetch("https://job-tracker-app-wrwz.onrender.com/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, // ✅ FIX
          body: JSON.stringify(formData),
        });
        data = await res.json();
        if (res.ok) setJobs([...jobs, data]);
      }
      setFormData({ company: "", role: "", status: "Applied" });
      setShowModal(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // DELETE JOB 
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://job-tracker-app-wrwz.onrender.com/api/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization:` Bearer ${token}`}, // ✅ FIX
      });
      if (res.ok) setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // EDIT CLICK 
  const handleEdit = (job) => {
    console.log("Editing job".job_id)
    setEditJobId(job._id);
    setFormData({ company: job.company, role: job.role, status: job.status });
    setShowModal(true);
  };

  const countByStatus = (status) => jobs.filter((job) => job.status === status).length;

 

  return (
    <div className="min-h-screen bg-slate-900 text-white flex relative">

      {/* Hamburger for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <HiMenu size={30} className="cursor-pointer" onClick={() => setSidebarOpen(true)} />
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            className="fixed md:relative inset-y-0 left-0 w-80 bg-slate-800 p-6 flex flex-col z-40"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Close button for mobile */}
            <div className="md:hidden flex justify-end mb-6">
              <button onClick={() => setSidebarOpen(false)} className="text-gray-300 hover:text-white">
                ✕
              </button>
            </div>

            {/* Profile Section */}
            <motion.div className="flex flex-col items-center mb-10">
              <img
                src={userProfile.avatar}
                alt="avatar"
                className="w-20 h-20 rounded-full mb-3 border-2 border-indigo-500"
              />
              <h2 className="text-xl font-semibold break-words ">{userProfile.name}</h2>
              <p className="text-gray-400 text-sm break-words ">{userProfile.email}</p>
            </motion.div>

            {/* Navigation / Shortcuts */}
            <motion.div className="flex flex-col gap-3 mt-5">
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                className="text-left px-3 py-2 rounded-lg hover:bg-indigo-600/50 transition"
              >
                Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                className="text-left px-3 py-2 rounded-lg hover:bg-indigo-600/50 transition"
                onClick={() => { setEditJobId(null); setShowModal(true); setSidebarOpen(false); }}
              >
                + Add Job
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                className="text-left px-3 py-2 rounded-lg hover:bg-indigo-600/50 transition"
                onClick={() => { localStorage.removeItem("token"); navigate('/login'); }}
              >
                Logout
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && window.innerWidth < 768 && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Main */}
      <div className="flex-1 p-6 md:p-10 md:ml-64">
        {/* Top */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <motion.h2
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Dashboard Overview
          </motion.h2>

          <div className="flex gap-4">
            <motion.button
              onClick={() => { setEditJobId(null); setShowModal(true); }}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Add Job
            </motion.button>

            <motion.button
              onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total" value={jobs.length} />
          <StatCard title="Interview" value={countByStatus("Interview")} />
          <StatCard title="Offer" value={countByStatus("Offer")} />
          <StatCard title="Rejected" value={countByStatus("Rejected")} />
        </div>

        {/* Jobs */}
        {jobs.length === 0 ? (
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No jobs added yet.
          </motion.p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ scale: 1.03, y: -3 }}
                className="bg-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden"
              >
                <h3 className="text-lg font-semibold mb-1">{job.company}</h3>
                <p className="text-gray-400 mb-4">{job.role}</p>

                <span
                  className={`text-sm px-3 py-1 rounded-full absolute top-4 right-4 font-semibold
                    ${job.status === "Applied" ? "bg-yellow-500/20 text-yellow-400" :
                      job.status === "Interview" ? "bg-blue-500/20 text-blue-400" :
                        job.status === "Offer" ? "bg-green-500/20 text-green-400" :
                          "bg-red-500/20 text-red-400"}`}
                >
                  {job.status}
                </span>

                <div className="flex justify-end gap-3 text-sm mt-6">
                  <motion.button
                    onClick={() => handleEdit(job)}
                    className="text-yellow-400 hover:text-yellow-500"
                    whileHover={{ scale: 1.1 }}
                  >
                    Edit
                  </motion.button>

                  <motion.button
                    onClick={() => handleDelete(job._id)}
                    className="text-red-400 hover:text-red-500"
                    whileHover={{ scale: 1.1 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800 p-8 rounded-xl w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-6">
                {editJobId ? "Edit Job" : "Add Job"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full p-3 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  type="text"
                  placeholder="Role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full p-3 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full p-3 bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-200 transition"
                  >
                    Cancel
                  </button>

                  <motion.button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {editJobId ? "Update" : "Add"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

//  STAT CARD
function StatCard({ title, value }) {
  return (
    <motion.div
      className="bg-slate-800 p-6 rounded-xl shadow-md"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-gray-400 text-sm">{title}</p>
      <motion.h2
        className="text-2xl font-bold mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {value}
      </motion.h2>
    </motion.div>
  );
}