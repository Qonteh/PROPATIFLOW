"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, Eye, Download } from "lucide-react";

interface Lease {
	id: string;
	status: string;
	template?: string;
	propertyName?: string;
	startDate?: string;
	endDate?: string;
	monthlyRent?: number;
	landlordName?: string;
}

export default function TenantLeasesPage() {
	const [leases, setLeases] = useState<Lease[]>([]);
	const [loading, setLoading] = useState(true);
	const [signing, setSigning] = useState<string | null>(null);
	const [selectedLease, setSelectedLease] = useState<Lease | null>(null);
	const [showPdfModal, setShowPdfModal] = useState(false);

	useEffect(() => {
		fetch("/api/leases")
			.then((res) => res.json())
			.then((data) => {
				setLeases(data.leases || []);
				setLoading(false);
			});
	}, []);

	const handleSign = async (leaseId: string) => {
		setSigning(leaseId);
		try {
			await fetch(`/api/leases/${leaseId}/sign`, { method: "POST" });
			setLeases((prev) =>
				prev.map((l) => (l.id === leaseId ? { ...l, status: "signed" } : l))
			);
		} catch (error) {
			console.error("Error signing lease broooo:", error);
		}
		setSigning(null);
	};

	const handleViewLease = (lease: Lease) => {
		setSelectedLease(lease);
		setShowPdfModal(true);
	};

	const handleDownloadLease = (template: string, propertyName: string) => {
		// In real implementation, this would trigger actual PDF download
		const link = document.createElement('a');
		link.href = template;
		link.download = `${propertyName}-Lease.pdf`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading your leases broooo...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
						<FileText className="h-8 w-8 text-blue-600" />
						My Leases
					</h1>
					<p className="text-gray-600 mt-2">View and sign your lease agreements broooo</p>
				</div>

				{/* Leases Grid */}
				{leases.length === 0 ? (
					<div className="bg-white rounded-lg shadow-sm p-12 text-center">
						<FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">No leases found</h3>
						<p className="text-gray-600">You don't have any active leases at the moment broooo</p>
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{leases.map((lease) => (
							<div
								key={lease.id}
								className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
							>
								{/* Property Image Placeholder */}
								<div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 relative">
									<div className="absolute inset-0 bg-black opacity-10"></div>
									<div className="absolute bottom-4 left-4 right-4">
										<span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
											lease.status === 'signed' 
												? 'bg-[#FFD700] text-[#1E3A8A]' 
												: 'bg-[#1E3A8A]/10 text-[#1E3A8A]'
										}`}>
											{lease.status === 'signed' ? (
												<><CheckCircle className="h-3 w-3 mr-1" /> Signed</>
											) : (
												<><Clock className="h-3 w-3 mr-1" /> Pending Signature</>
											)}
										</span>
									</div>
								</div>

								{/* Lease Details */}
								<div className="p-6">
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										{lease.propertyName || `Lease #${lease.id}`}
									</h3>
									
									<div className="space-y-2 mb-4">
										{lease.landlordName && (
											<p className="text-sm text-gray-600">
												<span className="font-medium">Landlord:</span> {lease.landlordName}
											</p>
										)}
										{lease.monthlyRent && (
											<p className="text-sm text-gray-600">
												<span className="font-medium">Monthly Rent:</span> ${lease.monthlyRent.toLocaleString()}
											</p>
										)}
										{lease.startDate && lease.endDate && (
											<p className="text-sm text-gray-600">
												<span className="font-medium">Term:</span>{' '}
												{new Date(lease.startDate).toLocaleDateString()} - {new Date(lease.endDate).toLocaleDateString()}
											</p>
										)}
									</div>

									{/* Action Buttons */}
									<div className="flex flex-col gap-2">
										{lease.template && (
											<>
												<button
													onClick={() => handleViewLease(lease)}
													className="w-full flex items-center justify-center gap-2 bg-[#FFD700]/10 text-[#1E3A8A] px-4 py-2 rounded-lg hover:bg-[#FFD700]/20 transition-colors font-medium"
												>
													<Eye className="h-4 w-4" />
													View Lease Contract
												</button>
												<button
													onClick={() => handleDownloadLease(lease.template!, lease.propertyName || `Lease-${lease.id}`)}
													className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A]/10 text-[#1E3A8A] px-4 py-2 rounded-lg hover:bg-[#1E3A8A]/20 transition-colors font-medium"
												>
													<Download className="h-4 w-4" />
													Download PDF
												</button>
											</>
										)}
										
										{lease.status !== "signed" && (
											<button
												className="w-full bg-[#1E3A8A] text-white px-4 py-2 rounded-lg hover:bg-[#FFD700] hover:text-[#1E3A8A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium mt-2"
												onClick={() => handleSign(lease.id)}
												disabled={signing === lease.id}
											>
												{signing === lease.id ? (
													<span className="flex items-center justify-center gap-2">
														<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
														Signing...
													</span>
												) : (
													"Sign Lease"
												)}
											</button>
										)}
										
										{lease.status === "signed" && (
											<div className="mt-2 p-3 bg-green-50 rounded-lg">
												<p className="text-sm text-green-700 flex items-center gap-2">
													<CheckCircle className="h-4 w-4" />
													You've signed this lease broooo!
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* PDF Viewer Modal */}
				{showPdfModal && selectedLease && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
							<div className="flex items-center justify-between p-6 border-b">
								<div>
									<h2 className="text-xl font-bold text-gray-900">
										{selectedLease.propertyName || 'Lease Agreement'}
									</h2>
									<p className="text-sm text-gray-600 mt-1">
										Status: <span className={`font-medium ${
											selectedLease.status === 'signed' ? 'text-green-600' : 'text-yellow-600'
										}`}>
											{selectedLease.status === 'signed' ? 'Signed' : 'Pending Signature'}
										</span>
									</p>
								</div>
								<button
									onClick={() => setShowPdfModal(false)}
									className="text-gray-400 hover:text-gray-600 transition-colors"
								>
									<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							
							<div className="flex-1 overflow-auto p-6 bg-gray-100">
								{/* Render real contract HTML from lease.template */}
								<div className="bg-white rounded-lg shadow p-8 min-h-[500px] flex flex-col items-center justify-center">
									{selectedLease.template ? (
										<div className="w-full max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: selectedLease.template }} />
									) : (
										<p className="text-gray-600">No contract template found broooo.</p>
									)}
									<div className="flex gap-4 mt-6">
										<button
											onClick={() => handleDownloadLease(selectedLease.template!, selectedLease.propertyName || `Lease-${selectedLease.id}`)}
											className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
										>
											<Download className="h-4 w-4" />
											Download PDF
										</button>
										{selectedLease.status !== 'signed' && (
											<button
												onClick={() => {
													handleSign(selectedLease.id);
													setShowPdfModal(false);
												}}
												className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
												disabled={signing === selectedLease.id}
											>
												{signing === selectedLease.id ? 'Signing...' : 'Sign Lease'}
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}