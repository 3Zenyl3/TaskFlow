import type { IconType } from "react-icons";
import "./StatisticCard.css"

interface StatisticCardProps {
  title: string;
  count: string;
  backgroundColor: string;
  color: string;
  emoji:IconType;
}

function StatisticCard({title, count, backgroundColor, color, emoji: Emoji}: StatisticCardProps) {
  return (
    <div className="allTask" style={{ "--card-backgroundColor": backgroundColor } as React.CSSProperties}>
      <h3 className="allTaskTitle" style={{ "--card-color": color } as React.CSSProperties}>{title}</h3>
      <p className="countTasks" style={{ "--card-color": color } as React.CSSProperties}>{count}</p>
      <div className="emojiStat">
        <Emoji color={color} />
      </div>
      
    </div>
  );
}

export default StatisticCard;
