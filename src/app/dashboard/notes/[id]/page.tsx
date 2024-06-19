import HistoryButton from "@/components/HistoryButton";
import prisma from "@/lib/db/prisma";

type SearchParams = {
  params: {
    id: string;
  };
};

export default async function page({ params }: SearchParams) {
  const patientId = params.id;

  const patient = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
    include: {
      History: true, // Include the patient's history records
    },
  });

  if (!patient) {
    return <div>Patient not found.</div>; // Handling the case when no patient is found
  }

  return (
    <div>
      <h1>Patient Details</h1>
      <p>
        <strong>Name:</strong> {patient?.fullName}
      </p>
      <p>
        <strong>Medical Condition:</strong>{" "}
        {patient?.medicalCondition || "None"}
      </p>
      <p>
        <strong>Age:</strong> {patient?.age}
      </p>
      <p>
        <strong>Gender:</strong> {patient?.gender}
      </p>
      <p>
        <strong>Phone Number:</strong> {patient?.phoneNumber}
      </p>
      <p>
        <strong>Email:</strong> {patient?.email || "Not provided"}
      </p>
      <p>
        <strong>Address:</strong> {patient?.address || "Not provided"}
      </p>
      <p>
        <strong>Emergency Contacts:</strong>{" "}
        {patient?.emergencyContacts || "Not provided"}
      </p>
      <p>
        <strong>Medical Histories:</strong>{" "}
        {patient?.medicalHistories || "Not provided"}
      </p>
      <p>
        <strong>Psychiatric Histories:</strong>{" "}
        {patient?.psychiatricHistories || "Not provided"}
      </p>
      <p>
        <strong>Intake Assessments:</strong>{" "}
        {patient?.intakeAssessments || "Not provided"}
      </p>
      <p>
        <strong>Additional Notes:</strong>{" "}
        {patient?.additionalNotes || "Not provided"}
      </p>
      <p>
        <strong>History Records:</strong>{" "}
        {patient.History.length > 0 ? (
          <ul>
            {patient?.History.map((history, index) => (
              <li key={history.id}>
                Diagnosis: {history.diagnosis || "No diagnosis recorded"}
                <br />
                history id: {history.treatments || "No treatments recorded"}
                <br />
                Notes: {history.notes || "No additional notes"}
                <br />
                <HistoryButton patientId={patient.id} history={history} />
              </li>
            ))}
          </ul>
        ) : (
          <HistoryButton patientId={patient.id} />
        )}
      </p>
      <p>
        <strong>Created At:</strong> {patient?.createdAt.toDateString()}
      </p>
      <p>
        <strong>Updated At:</strong> {patient?.updatedAt.toDateString()}
      </p>
    </div>
  );
}
