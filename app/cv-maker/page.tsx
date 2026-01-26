'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Plus, Trash2, FileText, User, Briefcase, GraduationCap, Code, BookOpen, Award } from 'lucide-react'

export default function CVMakerPage() {
    const [personalInfo, setPersonalInfo] = useState({
        fullName: '',
        city: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        linkedin: ''
    })

    const [education, setEducation] = useState([{ school: '', grade: '', graduationYear: '', gpa: '' }])
    const [majorAchievements, setMajorAchievements] = useState([{ title: '', year: '', description: '' }])
    const [researchProjects, setResearchProjects] = useState([{ title: '', year: '', description: '' }])
    const [activities, setActivities] = useState([{ role: '', organization: '', duration: '', description: '' }])
    const [awards, setAwards] = useState([{ title: '', year: '', description: '' }])
    const [skills, setSkills] = useState([{ category: '', items: '' }])

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="min-h-screen p-8 pt-20 md:p-8 print:p-0" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-center print:hidden">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">University Admission CV</h1>
                        <p className="text-gray-500">Build a professional academic resume for your application</p>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        Export PDF
                    </button>
                </header>

                <div className="grid lg:grid-cols-12 gap-8 print:block">
                    {/* Editor Form (Hidden when printing) */}
                    <div className="lg:col-span-5 space-y-8 print:hidden h-fit overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar pr-2">

                        {/* Personal Info */}
                        <section className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--border-color)' }}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-500" /> Personal Info
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Full Name"
                                    className="p-3 rounded-xl border bg-transparent w-full col-span-2"
                                    value={personalInfo.fullName}
                                    onChange={e => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                                />
                                <input
                                    placeholder="City, Country"
                                    className="p-3 rounded-xl border bg-transparent w-full"
                                    value={personalInfo.city}
                                    onChange={e => setPersonalInfo({ ...personalInfo, city: e.target.value })}
                                />
                                <input
                                    placeholder="Date of Birth"
                                    className="p-3 rounded-xl border bg-transparent w-full"
                                    value={personalInfo.dateOfBirth}
                                    onChange={e => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                                />
                                <input
                                    placeholder="Email"
                                    className="p-3 rounded-xl border bg-transparent w-full"
                                    value={personalInfo.email}
                                    onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                />
                                <input
                                    placeholder="Phone"
                                    className="p-3 rounded-xl border bg-transparent w-full"
                                    value={personalInfo.phone}
                                    onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                />
                            </div>
                        </section>

                        {/* Education */}
                        <section className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--border-color)' }}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-purple-500" /> Education
                            </h2>
                            {education.map((edu, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-xl relative">
                                    <div className="grid gap-3">
                                        <input
                                            placeholder="School Name"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={edu.school}
                                            onChange={e => {
                                                const newEdu = [...education]
                                                newEdu[index].school = e.target.value
                                                setEducation(newEdu)
                                            }}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                placeholder="Grade (e.g. 11th Grade)"
                                                className="p-2 rounded-lg border bg-transparent w-full"
                                                value={edu.grade}
                                                onChange={e => {
                                                    const newEdu = [...education]
                                                    newEdu[index].grade = e.target.value
                                                    setEducation(newEdu)
                                                }}
                                            />
                                            <input
                                                placeholder="Exp. Graduation (e.g. 2026)"
                                                className="p-2 rounded-lg border bg-transparent w-full"
                                                value={edu.graduationYear}
                                                onChange={e => {
                                                    const newEdu = [...education]
                                                    newEdu[index].graduationYear = e.target.value
                                                    setEducation(newEdu)
                                                }}
                                            />
                                        </div>
                                        <input
                                            placeholder="GPA (e.g. 5.0/5.0)"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={edu.gpa}
                                            onChange={e => {
                                                const newEdu = [...education]
                                                newEdu[index].gpa = e.target.value
                                                setEducation(newEdu)
                                            }}
                                        />
                                    </div>
                                    {index > 0 && (
                                        <button
                                            onClick={() => setEducation(education.filter((_, i) => i !== index))}
                                            className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={() => setEducation([...education, { school: '', grade: '', graduationYear: '', gpa: '' }])}
                                className="flex items-center gap-2 text-sm text-blue-500 font-medium hover:underline"
                            >
                                <Plus className="w-4 h-4" /> Add Education
                            </button>
                        </section>

                        {/* Major Achievements */}
                        <section className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--border-color)' }}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" /> Major Achievements
                            </h2>
                            {majorAchievements.map((item, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-xl relative">
                                    <div className="grid gap-3">
                                        <input
                                            placeholder="Title / Achievement"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={item.title}
                                            onChange={e => {
                                                const newItems = [...majorAchievements]
                                                newItems[index].title = e.target.value
                                                setMajorAchievements(newItems)
                                            }}
                                        />
                                        <input
                                            placeholder="Year / Date"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={item.year}
                                            onChange={e => {
                                                const newItems = [...majorAchievements]
                                                newItems[index].year = e.target.value
                                                setMajorAchievements(newItems)
                                            }}
                                        />
                                        <textarea
                                            placeholder="Description"
                                            className="p-2 rounded-lg border bg-transparent w-full h-20"
                                            value={item.description}
                                            onChange={e => {
                                                const newItems = [...majorAchievements]
                                                newItems[index].description = e.target.value
                                                setMajorAchievements(newItems)
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setMajorAchievements(majorAchievements.filter((_, i) => i !== index))}
                                        className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setMajorAchievements([...majorAchievements, { title: '', year: '', description: '' }])}
                                className="flex items-center gap-2 text-sm text-blue-500 font-medium hover:underline"
                            >
                                <Plus className="w-4 h-4" /> Add Achievement
                            </button>
                        </section>

                        {/* Research & Projects */}
                        <section className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--border-color)' }}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-indigo-500" /> Research & Projects
                            </h2>
                            {researchProjects.map((item, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-xl relative">
                                    <div className="grid gap-3">
                                        <input
                                            placeholder="Project Title"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={item.title}
                                            onChange={e => {
                                                const newItems = [...researchProjects]
                                                newItems[index].title = e.target.value
                                                setResearchProjects(newItems)
                                            }}
                                        />
                                        <input
                                            placeholder="Year"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={item.year}
                                            onChange={e => {
                                                const newItems = [...researchProjects]
                                                newItems[index].year = e.target.value
                                                setResearchProjects(newItems)
                                            }}
                                        />
                                        <textarea
                                            placeholder="Description"
                                            className="p-2 rounded-lg border bg-transparent w-full h-20"
                                            value={item.description}
                                            onChange={e => {
                                                const newItems = [...researchProjects]
                                                newItems[index].description = e.target.value
                                                setResearchProjects(newItems)
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setResearchProjects(researchProjects.filter((_, i) => i !== index))}
                                        className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setResearchProjects([...researchProjects, { title: '', year: '', description: '' }])}
                                className="flex items-center gap-2 text-sm text-blue-500 font-medium hover:underline"
                            >
                                <Plus className="w-4 h-4" /> Add Project
                            </button>
                        </section>

                        {/* Leadership & Extracurriculars */}
                        <section className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--border-color)' }}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-green-500" /> Leadership & Extracurriculars
                            </h2>
                            {activities.map((act, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-xl relative">
                                    <div className="grid gap-3">
                                        <input
                                            placeholder="Role / Position"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={act.role}
                                            onChange={e => {
                                                const newActs = [...activities]
                                                newActs[index].role = e.target.value
                                                setActivities(newActs)
                                            }}
                                        />
                                        <input
                                            placeholder="Organization / Event"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={act.organization}
                                            onChange={e => {
                                                const newActs = [...activities]
                                                newActs[index].organization = e.target.value
                                                setActivities(newActs)
                                            }}
                                        />
                                        <input
                                            placeholder="Duration / Year"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={act.duration}
                                            onChange={e => {
                                                const newActs = [...activities]
                                                newActs[index].duration = e.target.value
                                                setActivities(newActs)
                                            }}
                                        />
                                        <textarea
                                            placeholder="Description"
                                            className="p-2 rounded-lg border bg-transparent w-full h-20"
                                            value={act.description}
                                            onChange={e => {
                                                const newActs = [...activities]
                                                newActs[index].description = e.target.value
                                                setActivities(newActs)
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setActivities(activities.filter((_, i) => i !== index))}
                                        className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setActivities([...activities, { role: '', organization: '', duration: '', description: '' }])}
                                className="flex items-center gap-2 text-sm text-blue-500 font-medium hover:underline"
                            >
                                <Plus className="w-4 h-4" /> Add Activity
                            </button>
                        </section>

                        {/* Awards & Recognition */}
                        <section className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--border-color)' }}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-orange-500" /> Awards & Recognition
                            </h2>
                            {awards.map((award, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-xl relative">
                                    <div className="grid gap-3">
                                        <input
                                            placeholder="Award Title"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={award.title}
                                            onChange={e => {
                                                const newAwards = [...awards]
                                                newAwards[index].title = e.target.value
                                                setAwards(newAwards)
                                            }}
                                        />
                                        <input
                                            placeholder="Year"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={award.year}
                                            onChange={e => {
                                                const newAwards = [...awards]
                                                newAwards[index].year = e.target.value
                                                setAwards(newAwards)
                                            }}
                                        />
                                        <input
                                            placeholder="Description (Optional)"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={award.description}
                                            onChange={e => {
                                                const newAwards = [...awards]
                                                newAwards[index].description = e.target.value
                                                setAwards(newAwards)
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setAwards(awards.filter((_, i) => i !== index))}
                                        className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setAwards([...awards, { title: '', year: '', description: '' }])}
                                className="flex items-center gap-2 text-sm text-blue-500 font-medium hover:underline"
                            >
                                <Plus className="w-4 h-4" /> Add Award
                            </button>
                        </section>

                        {/* Skills */}
                        <section className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--border-color)' }}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Code className="w-5 h-5 text-teal-500" /> Skills
                            </h2>
                            {skills.map((skill, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-xl relative">
                                    <div className="grid gap-3">
                                        <input
                                            placeholder="Category (e.g. Languages)"
                                            className="p-2 rounded-lg border bg-transparent w-full font-bold"
                                            value={skill.category}
                                            onChange={e => {
                                                const newSkills = [...skills]
                                                newSkills[index].category = e.target.value
                                                setSkills(newSkills)
                                            }}
                                        />
                                        <textarea
                                            placeholder="Items (e.g. English (C1), Russian (Native))"
                                            className="p-2 rounded-lg border bg-transparent w-full"
                                            value={skill.items}
                                            onChange={e => {
                                                const newSkills = [...skills]
                                                newSkills[index].items = e.target.value
                                                setSkills(newSkills)
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                                        className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setSkills([...skills, { category: '', items: '' }])}
                                className="flex items-center gap-2 text-sm text-blue-500 font-medium hover:underline"
                            >
                                <Plus className="w-4 h-4" /> Add Skill Category
                            </button>
                        </section>

                    </div>

                    {/* Live Preview (Printable Area) */}
                    <div className="lg:col-span-7 bg-white !text-black p-12 shadow-xl print:shadow-none print:w-full min-h-[1100px] print:min-h-0 print:p-0 print:m-0">

                        {/* Header */}
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold mb-2 !text-black">{personalInfo.fullName || 'Your Name'}</h1>
                            <div className="text-sm !text-black flex flex-wrap justify-center gap-x-1">
                                {personalInfo.city && <span>{personalInfo.city}</span>}
                                {personalInfo.city && personalInfo.email && <span>|</span>}
                                {personalInfo.email && <span>{personalInfo.email}</span>}
                                {personalInfo.email && personalInfo.phone && <span>|</span>}
                                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                            </div>
                            {personalInfo.dateOfBirth && (
                                <div className="text-sm !text-black mt-1">
                                    Date of Birth: {personalInfo.dateOfBirth}
                                </div>
                            )}
                        </div>

                        {/* Education */}
                        {education.some(e => e.school) && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold border-b border-black mb-2 !text-black">Education</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="mb-2">
                                        <div className="font-bold !text-black">
                                            {edu.school} {edu.grade && <span>— {edu.grade}</span>}
                                        </div>
                                        <div className="!text-black text-sm">
                                            {edu.graduationYear && <div>Expected Graduation: {edu.graduationYear}</div>}
                                            {edu.gpa && <ul className="list-disc list-inside ml-2"><li>GPA: {edu.gpa}</li></ul>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Major Achievements */}
                        {majorAchievements.some(m => m.title) && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-center mb-2 !text-black">Major Achievements</h3>
                                <ul className="list-disc list-outside ml-5 space-y-2 !text-black text-sm">
                                    {majorAchievements.map((item, i) => (
                                        <li key={i}>
                                            <span className="font-bold">{item.title}</span>
                                            {item.year && <span> ({item.year})</span>}
                                            {item.description && <span> – {item.description}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Research & Projects */}
                        {researchProjects.some(r => r.title) && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-center mb-2 !text-black">Research & Projects</h3>
                                <ul className="list-disc list-outside ml-5 space-y-2 !text-black text-sm">
                                    {researchProjects.map((item, i) => (
                                        <li key={i}>
                                            <span className="font-bold">{item.title}</span>
                                            {item.year && <span> ({item.year})</span>}
                                            {item.description && <span> – {item.description}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Leadership & Extracurriculars */}
                        {activities.some(a => a.role) && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold border-b border-black mb-2 !text-black">Leadership & Extracurriculars</h3>
                                <ul className="list-disc list-outside ml-5 space-y-2 !text-black text-sm">
                                    {activities.map((act, i) => (
                                        <li key={i}>
                                            <span className="font-bold">{act.role}</span>
                                            {act.organization && <span>, {act.organization}</span>}
                                            {act.duration && <span> ({act.duration})</span>}
                                            {act.description && <span> – {act.description}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Awards & Recognition */}
                        {awards.some(a => a.title) && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold border-b border-black mb-2 !text-black">Awards & Recognition</h3>
                                <ul className="list-disc list-outside ml-5 space-y-1 !text-black text-sm">
                                    {awards.map((award, i) => (
                                        <li key={i}>
                                            <span className="font-bold">{award.title}</span>
                                            {award.year && <span> ({award.year})</span>}
                                            {award.description && <span>, {award.description}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Skills */}
                        {skills.some(s => s.category) && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold border-b border-black mb-2 !text-black">Skills</h3>
                                <ul className="list-disc list-outside ml-5 space-y-1 !text-black text-sm">
                                    {skills.map((skill, i) => (
                                        <li key={i}>
                                            <span className="font-bold">{skill.category}:</span> {skill.items}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
