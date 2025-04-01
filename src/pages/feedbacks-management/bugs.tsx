import FeedbacksManagement from "@/components/AdministrativeTools/FeedbackManagement/FeedbackManagement";
import Bugs from "@/components/AdministrativeTools/FeedbackManagement/Bugs/Bugs";

export default function page() {
  return (
    <FeedbacksManagement>
      <Bugs />
    </FeedbacksManagement>
  );
}
