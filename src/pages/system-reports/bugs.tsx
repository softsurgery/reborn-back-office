import FeedbacksManagement from   "@/components/AdministrativeTools/SystemReports/FeedbackManagement";
import Bugs from "@/components/AdministrativeTools/SystemReports/Bugs/Bugs";

export default function page() {
  return (
    <FeedbacksManagement>
      <Bugs />
    </FeedbacksManagement>
  );
}
