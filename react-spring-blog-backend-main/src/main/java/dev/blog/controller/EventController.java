package dev.blog.controller;

import dev.blog.dto.request.event.EventRequestDto;
import dev.blog.dto.request.event.EventUpdateRequestDto;
import dev.blog.dto.response.event.EventResponseDto;
import dev.blog.entity.Event;
import dev.blog.entity.Member;
import dev.blog.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/event")
public class EventController {

    private final EventService eventService;

    // 캘린더 일정 등록
    @PostMapping
    public ResponseEntity<EventResponseDto> addEvent(@RequestBody EventRequestDto request,
                                                     @AuthenticationPrincipal Member member) {
        Event event = eventService.addEvent(request, member);
        EventResponseDto response = new EventResponseDto(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 캘린더 전체 일정 보기
    @GetMapping
    public ResponseEntity<List<EventResponseDto>> findAllEvent(@AuthenticationPrincipal Member member) {
        List<Event> events = eventService.findAllEvent(member);
        List<EventResponseDto> responses = events.stream().map(EventResponseDto::new).collect(Collectors.toList());
        System.out.println(responses);
        return ResponseEntity.status(HttpStatus.OK).body(responses);
    }

    // 캘린더 날짜로 일정 조회
    @GetMapping("/date/{formattedDate}")
    public ResponseEntity<EventResponseDto> findDateEvent(@PathVariable("formattedDate") LocalDate date,
                                                          @AuthenticationPrincipal Member member) {
        Event event = eventService.findDateEvent(date, member);
        EventResponseDto response = new EventResponseDto(event);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponseDto> detailEvent(@PathVariable("eventId") Long eventId,
                                                        @AuthenticationPrincipal Member member) {
        Event event = eventService.detailEvent(eventId, member);
        EventResponseDto response = new EventResponseDto(event);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventResponseDto> updateEvent(@PathVariable("eventId") Long eventId,
                                                        @RequestBody EventUpdateRequestDto request,
                                                        @AuthenticationPrincipal Member member) {
        Event event = eventService.updateEvent(member, eventId, request);
        EventResponseDto response = new EventResponseDto(event);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<String> deleteEvent(@PathVariable("eventId") Long eventId,
                                              @AuthenticationPrincipal Member member) {
        eventService.deleteEvent(member, eventId);
        return ResponseEntity.status(HttpStatus.OK).body("일정 삭제 완료");
    }
}
