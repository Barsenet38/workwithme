// C:\Users\yonas\Documents\HR\src\app\[company]\manager\performance\[id]\page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";

interface PerformanceReview {
  id: string;
  reviewDate: string;
  goals?: string;
  strengths?: string;
  improvements?: string;
  rating?: number;
  feedback?: string;
  isCompleted: boolean;
  completedAt?: string;
  reviewee: {
    id: string;
    firstName: string;
    lastName: string;
    department?: {
      name: string;
    };
    position: string;
    employmentType: string;
    dateHired?: string;
  };
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface UserData {
  userId: string;
  companyId: string;
  companySubdomain: string;
}

export default function PerformanceReviewPage() {
  const [review, setReview] = useState<PerformanceReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    goals: "",
    strengths: "",
    improvements: "",
    rating: 0,
    feedback: "",
    isCompleted: false
  });
  
  const params = useParams();
  const router = useRouter();
  const reviewId = params.id as string;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<UserData>(token);
        setUserData(decoded);
      } catch {
        setError("Invalid token");
        setLoading(false);
      }
    } else {
      setError("Not authenticated");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchReview = async () => {
      if (!userData) return;
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/manager/performance/${reviewId}`, {
          params: {
            companyId: userData.companyId,
          },
        });
        
        if (res.data.success) {
          setReview(res.data.data);
          setFormData({
            goals: res.data.data.goals || "",
            strengths: res.data.data.strengths || "",
            improvements: res.data.data.improvements || "",
            rating: res.data.data.rating || 0,
            feedback: res.data.data.feedback || "",
            isCompleted: res.data.data.isCompleted
          });
        } else {
          setError(res.data.message || "Failed to fetch performance review");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching performance review");
      } finally {
        setLoading(false);
      }
    };
    
    if (userData) {
      fetchReview();
    }
  }, [userData, reviewId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "rating" || name === "isCompleted" ? 
        (name === "isCompleted" ? (value === "true") : parseInt(value)) : 
        value
    }));
  };

  const handleSave = async () => {
    if (!userData) return;
    
    try {
      setSaving(true);
      const res = await axios.post(`http://localhost:5000/manager/performance/${reviewId}`, {
        ...formData,
        companyId: userData.companyId,
      });
      
      if (res.data.success) {
        setReview(res.data.data);
        setIsEditing(false);
        // Redirect back to the performance page if marked as completed
        if (formData.isCompleted && !review?.isCompleted) {
          router.push(`/${userData.companySubdomain}/manager/performance`);
        }
      } else {
        setError(res.data.message || "Failed to update performance review");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while updating performance review");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
        <MainLayout title="Performance Review" description="View and complete performance reviews" showHeader>
          <div className="p-6 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        </MainLayout>
      </RoleLayout>
    );
  }

  if (error || !review) {
    return (
      <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
        <MainLayout title="Performance Review" description="View and complete performance reviews" showHeader>
          <div className="p-6 bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300">
            <p>{error || "Performance review not found"}</p>
          </div>
        </MainLayout>
      </RoleLayout>
    );
  }

  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
      <MainLayout title="Performance Review" description="View and complete performance reviews" showHeader>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Performance Review</h1>
            <div className="flex space-x-2">
              {!review.isCompleted && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              )}
              {isEditing && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Employee Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Employee</p>
                    <p className="text-white font-medium">
                      {review.reviewee.firstName} {review.reviewee.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Position</p>
                    <p className="text-white font-medium">{review.reviewee.position}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Department</p>
                    <p className="text-white font-medium">{review.reviewee.department?.name || "Not assigned"}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Employment Type</p>
                    <p className="text-white font-medium">{review.reviewee.employmentType}</p>
                  </div>
                  {review.reviewee.dateHired && (
                    <div>
                      <p className="text-slate-400 text-sm">Date Hired</p>
                      <p className="text-white font-medium">{formatDate(review.reviewee.dateHired)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Review Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-slate-400 text-sm">Review Date</p>
                    <p className="text-white font-medium">{formatDate(review.reviewDate)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Reviewer</p>
                    <p className="text-white font-medium">
                      {review.reviewer.firstName} {review.reviewer.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Status</p>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        review.isCompleted
                          ? "bg-green-700 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {review.isCompleted ? "COMPLETED" : "PENDING"}
                    </span>
                  </div>
                  {review.completedAt && (
                    <div>
                      <p className="text-slate-400 text-sm">Completed At</p>
                      <p className="text-white font-medium">{formatDate(review.completedAt)}</p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-slate-400 text-sm mb-2">Rating</label>
                  {isEditing ? (
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                    >
                      <option value={0}>Select Rating</option>
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
                    </select>
                  ) : review.rating ? (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-6 h-6 ${i < review.rating! ? 'text-yellow-400' : 'text-slate-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-white">({review.rating}/5)</span>
                    </div>
                  ) : (
                    <p className="text-slate-400">Not rated yet</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-slate-400 text-sm mb-2">Goals</label>
                  {isEditing ? (
                    <textarea
                      name="goals"
                      value={formData.goals}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                    />
                  ) : review.goals ? (
                    <p className="text-white whitespace-pre-wrap">{review.goals}</p>
                  ) : (
                    <p className="text-slate-400">No goals specified</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-slate-400 text-sm mb-2">Strengths</label>
                  {isEditing ? (
                    <textarea
                      name="strengths"
                      value={formData.strengths}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                    />
                  ) : review.strengths ? (
                    <p className="text-white whitespace-pre-wrap">{review.strengths}</p>
                  ) : (
                    <p className="text-slate-400">No strengths specified</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-slate-400 text-sm mb-2">Areas for Improvement</label>
                  {isEditing ? (
                    <textarea
                      name="improvements"
                      value={formData.improvements}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                    />
                  ) : review.improvements ? (
                    <p className="text-white whitespace-pre-wrap">{review.improvements}</p>
                  ) : (
                    <p className="text-slate-400">No improvements specified</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-slate-400 text-sm mb-2">Feedback</label>
                  {isEditing ? (
                    <textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                    />
                  ) : review.feedback ? (
                    <p className="text-white whitespace-pre-wrap">{review.feedback}</p>
                  ) : (
                    <p className="text-slate-400">No feedback provided</p>
                  )}
                </div>

                {isEditing && (
                  <div className="mb-6">
                    <label className="block text-slate-400 text-sm mb-2">Completion Status</label>
                    <select
                      name="isCompleted"
                      value={formData.isCompleted.toString()}
                      onChange={handleInputChange}
                      className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                    >
                      <option value="false">In Progress</option>
                      <option value="true">Complete</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Actions</h2>
                <div className="space-y-3">
                  {!review.isCompleted && (
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="w-full px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500"
                    >
                      {isEditing ? "Cancel Editing" : "Edit Review"}
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/${userData?.companySubdomain}/manager/performance`)}
                    className="w-full px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600"
                  >
                    Back to Performance Reviews
                  </button>
                </div>
              </div>

              {review.isCompleted && (
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-green-400">Review Completed</h3>
                  </div>
                  <p className="text-green-300 text-sm">
                    This performance review was completed on {formatDate(review.completedAt!)}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}