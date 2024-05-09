package dev.blog.dto.response.event;


import com.fasterxml.jackson.annotation.JsonFormat;
import dev.blog.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class EventResponseDto {
    private String title;
    private String color;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private String startingHour;
    private String endingHour;
    private String summary;

    @Builder
    public EventResponseDto(Event event) {
        this.title = event.getTitle();
        this.color = event.getColor();
        this.date = event.getDate();
        this.startingHour = event.getStartingHour();
        this.endingHour = event.getEndingHour();
        this.summary = event.getSummary();
    }


//    public EventResponseDto toEntity(Event event) {
//        return EventResponseDto.builder()
//                .title(event.getTitle())
//                .color(event.getColor())
//                .date(event.getDate())
//                .startingHour(event.getStartingHour())
//                .endingHour(event.getEndingHour())
//                .summary(event.getSummary())
//                .build();
//    }
}
