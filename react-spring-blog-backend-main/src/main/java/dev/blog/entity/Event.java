package dev.blog.entity;

import dev.blog.common.BaseTimeEntity;
import dev.blog.dto.request.event.EventUpdateRequestDto;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String color;
    private String date;
    private String startingHour;
    private String endingHour;
    private String summary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    public Member member;

    @Builder
    public Event(String title, String color, String date, String startingHour, String endingHour, String summary) {
        this.title = title;
        this.color = color;
        this.date = date;
        this.startingHour = startingHour;
        this.endingHour = endingHour;
        this.summary = summary;
    }

    //== Member & Event 연관관계 편의 메소드 ==//
    public void setMappingMember(Member member) {
        this.member = member;
        member.getEvent().add(this);
    }

    public void updateEvent(EventUpdateRequestDto request) {
        this.title = request.getTitle();
        this.color = request.getColor();
        this.date = request.getDate();
        this.startingHour = request.getStartingHour();
        this.endingHour = request.getEndingHour();
        this.summary = request.getSummary();
    }
}